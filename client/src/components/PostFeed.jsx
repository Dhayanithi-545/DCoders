import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircle, MessageSquare, Heart, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [answerModal, setAnswerModal] = useState(null);
  const [answerForm, setAnswerForm] = useState({ description: '', codeSnippet: '' });
  const [commentLoading, setCommentLoading] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [activePanel, setActivePanel] = useState({}); // { [postId]: 'answers' | 'comments' | null }

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:9001/api/posts/', { withCredentials: true })
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    setLikeLoading(postId);
    try {
      const res = await axios.put(`http://localhost:9001/api/posts/${postId}/like`, {}, { withCredentials: true });
      setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
    } finally {
      setLikeLoading(null);
    }
  };

  const handleBookmark = async (postId) => {
    setBookmarkLoading(postId);
    try {
      const res = await axios.put(`http://localhost:9001/api/posts/${postId}/bookmark`, {}, { withCredentials: true });
      setPosts(posts => posts.map(p => {
        if (p._id !== postId) return p;
        let bookmarkedBy = Array.isArray(p.bookmarkedBy) ? [...p.bookmarkedBy] : [];
        if (res.data.bookmarked) {
          if (!bookmarkedBy.includes(user._id)) bookmarkedBy.push(user._id);
        } else {
          bookmarkedBy = bookmarkedBy.filter(id => id !== user._id);
        }
        return { ...p, bookmarkedBy };
      }));
    } finally {
      setBookmarkLoading(null);
    }
  };

  const handleComment = async (postId) => {
    setCommentLoading(postId);
    try {
      const res = await axios.post(`http://localhost:9001/api/posts/${postId}/comment`, { commentText: commentText[postId] }, { withCredentials: true });
      setPosts(posts => posts.map(p => p._id === postId ? { ...p, comments: res.data } : p));
      setCommentText({ ...commentText, [postId]: '' });
    } finally {
      setCommentLoading(null);
    }
  };

  const handleAnswer = async (postId) => {
    setAnswerLoading(postId);
    try {
      const res = await axios.post(`http://localhost:9001/api/posts/${postId}/answer`, answerForm, { withCredentials: true });
      setPosts(posts => posts.map(p => p._id === postId ? { ...p, answers: res.data } : p));
      setAnswerForm({ description: '', codeSnippet: '' });
      setAnswerModal(null);
    } finally {
      setAnswerLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-800 rounded-2xl p-6 h-40" />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return <div className="text-slate-400 text-center mt-8">No posts yet.</div>;
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      {posts.map(post => {
        const liked = user && Array.isArray(post.likes) && post.likes.includes(user._id);
        const bookmarked = user && Array.isArray(post.bookmarkedBy) && post.bookmarkedBy.includes(user._id);
        const panelType = activePanel[post._id];
        return (
          <div key={post._id} className="relative bg-slate-800 rounded-2xl p-6 shadow-2xl flex">
            {/* Main post content */}
            <div className="flex-1 cursor-pointer" onDoubleClick={() => navigate(`/post/${post._id}`)}>
              <div className="flex items-center gap-3 mb-2">
                <img src={post.author.profilePicture || 'https://placehold.co/32x32?text=U'} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-cyan-400" />
                <span className="font-inter text-slate-100 text-sm font-semibold">{post.author.username}</span>
                <span className="text-slate-400 text-xs ml-2">{new Date(post.createdAt).toLocaleString()}</span>
                <span className="ml-auto text-xs px-2 py-1 bg-slate-700 rounded-full">{post.category}</span>
              </div>
              <div className="mb-2">
                <h2 className="font-bold text-xl text-cyan-400 mb-1">{post.title}</h2>
                <p className="text-slate-100 text-sm mb-2">
                  {post.description.length > 120 ? post.description.slice(0, 120) + '... Read more' : post.description}
                </p>
                {post.codeSnippet && (
                  <div className="relative group">
                    {(() => {
                      const lines = post.codeSnippet.split('\n');
                      const isLong = lines.length > 10 || post.codeSnippet.length > 500;
                      const preview = isLong ? lines.slice(0, 10).join('\n').slice(0, 500) : post.codeSnippet;
                      return (
                        <>
                          <pre
                            className={`bg-slate-900 rounded p-3 overflow-x-auto text-xs text-slate-200 mb-2 font-mono max-h-[200px] ${isLong ? 'overflow-hidden' : ''}`}
                            onDoubleClick={() => navigate(`/post/${post._id}`)}
                          >
                            <code>{preview}</code>
                          </pre>
                          {isLong && (
                            <>
                              <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-slate-900 rounded-b" />
                              <div className="text-xs text-cyan-400 italic mt-2 select-none">Double-click to view full post</div>
                              <button
                                className="text-xs text-cyan-400 underline mt-1 block md:hidden"
                                onClick={e => { e.stopPropagation(); navigate(`/post/${post._id}`); }}
                              >Show More</button>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
            {/* Vertical action bar */}
            <div className="flex flex-col items-center gap-4 ml-4">
              <button className="flex flex-col items-center text-green-400 hover:scale-110 transition-transform" title="Answer" onClick={() => setActivePanel({ ...activePanel, [post._id]: panelType === 'answers' ? null : 'answers' })}>
                <MessageCircle size={20} />
                <span className="text-xs mt-1">Answer</span>
              </button>
              <button className="flex flex-col items-center text-slate-400 hover:text-cyan-400" title="Comment" onClick={() => setActivePanel({ ...activePanel, [post._id]: panelType === 'comments' ? null : 'comments' })}>
                <MessageSquare size={20} />
                <span className="text-xs mt-1">Comment</span>
              </button>
              <button
                className={`flex flex-col items-center ${liked ? 'text-red-500 scale-110' : 'text-slate-400 hover:text-red-400'} transition-transform`}
                title="Like"
                onClick={() => handleLike(post._id)}
                disabled={likeLoading === post._id}
              >
                <Heart fill={liked ? 'currentColor' : 'none'} size={20} />
                <span className="text-xs mt-1">{post.likes.length}</span>
              </button>
              <button
                className={`flex flex-col items-center ${bookmarked ? 'text-cyan-400 drop-shadow-glow' : 'text-slate-400 hover:text-cyan-400'}`}
                title="Bookmark"
                onClick={() => handleBookmark(post._id)}
                disabled={bookmarkLoading === post._id}
              >
                <Bookmark fill={bookmarked ? 'currentColor' : 'none'} size={20} />
              </button>
            </div>
            {/* Side panel overlay for answers/comments */}
            {panelType === 'comments' && (
              <div className="absolute top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-700 rounded-r-2xl shadow-2xl z-20 flex flex-col p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-400 font-bold text-sm">Comments</span>
                  <button className="text-slate-400 hover:text-cyan-400" onClick={() => setActivePanel({ ...activePanel, [post._id]: null })}>×</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {post.comments && post.comments.length > 0 ? (
                    <div className="flex flex-col gap-2 mb-2">
                      {post.comments.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-800 rounded p-2 text-xs">
                          <img src={c.userId?.profilePicture || 'https://placehold.co/24x24?text=U'} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-semibold text-slate-100">{c.userId?.username || 'User'}</span>
                          <span className="text-slate-400">{c.commentText}</span>
                          <span className="ml-auto text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-slate-500 text-xs">No comments yet.</div>}
                </div>
                <div className="flex gap-2 mt-2">
                  <textarea
                    className="flex-1 bg-slate-800 rounded px-2 py-1 text-xs text-slate-100 placeholder:text-slate-400 outline-none"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ''}
                    onChange={e => setCommentText({ ...commentText, [post._id]: e.target.value })}
                  />
                  <button
                    className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1 rounded text-xs"
                    onClick={() => handleComment(post._id)}
                    disabled={commentLoading === post._id || !(commentText[post._id] && commentText[post._id].trim())}
                  >
                    {commentLoading === post._id ? '...' : 'Post'}
                  </button>
                </div>
              </div>
            )}
            {panelType === 'answers' && (
              <div className="absolute top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-700 rounded-r-2xl shadow-2xl z-20 flex flex-col p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400 font-bold text-sm">Answers</span>
                  <button className="text-slate-400 hover:text-green-400" onClick={() => setActivePanel({ ...activePanel, [post._id]: null })}>×</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {post.answers && post.answers.length > 0 ? (
                    <div className="flex flex-col gap-2 mb-2">
                      {post.answers.map((a, i) => (
                        <div key={i} className="flex flex-col bg-slate-800 rounded p-2 text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <img src={a.userId?.profilePicture || 'https://placehold.co/24x24?text=U'} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-semibold text-slate-100">{a.userId?.username || 'User'}</span>
                            <span className="ml-auto text-slate-500">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</span>
                          </div>
                          <div className="text-slate-100 mb-1">{a.description}</div>
                          {a.codeSnippet && (
                            <pre className="bg-slate-900 rounded p-2 overflow-x-auto text-xs text-slate-200"><code>{a.codeSnippet}</code></pre>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-slate-500 text-xs">No answers yet.</div>}
                </div>
                <div className="mt-2">
                  <textarea
                    className="w-full bg-slate-800 rounded px-2 py-1 text-xs text-slate-100 placeholder:text-slate-400 outline-none mb-2"
                    placeholder="Write your answer..."
                    value={answerModal === post._id ? answerForm.description : ''}
                    onChange={e => setAnswerForm({ ...answerForm, description: e.target.value })}
                  />
                  <textarea
                    className="w-full bg-slate-800 rounded px-2 py-1 text-xs text-slate-100 placeholder:text-slate-400 outline-none font-mono mb-2"
                    placeholder="Code Snippet (optional)"
                    value={answerModal === post._id ? answerForm.codeSnippet : ''}
                    onChange={e => setAnswerForm({ ...answerForm, codeSnippet: e.target.value })}
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setActivePanel({ ...activePanel, [post._id]: null })} className="px-3 py-1 rounded bg-slate-600 text-slate-100 hover:bg-slate-700 text-xs">Cancel</button>
                    <button type="button" onClick={() => handleAnswer(post._id)} disabled={answerLoading === post._id || !answerForm.description.trim()} className="px-3 py-1 rounded bg-green-400 text-slate-900 font-bold hover:bg-green-500 disabled:opacity-60 text-xs">
                      {answerLoading === post._id ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostFeed; 