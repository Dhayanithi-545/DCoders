import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Sidebar from '../components/Sidebar';
import { Brain, MessageSquare, Copy, Bookmark, BookmarkCheck, ThumbsUp } from 'lucide-react';

const Tabs = ({ active, setActive, tabs }) => (
  <div className="flex gap-2 mb-4 border-b border-slate-700">
    {tabs.map(tab => (
      <button
        key={tab.title}
        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold text-sm transition-colors ${active === tab.title ? 'bg-slate-900 text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}
        onClick={() => setActive(tab.title)}
      >
        {tab.icon}
        {tab.title}
      </button>
    ))}
  </div>
);

const FullPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Answers');
  const [answerText, setAnswerText] = useState('');
  const [answerCode, setAnswerCode] = useState('');
  const [commentText, setCommentText] = useState('');
  const [postingAnswer, setPostingAnswer] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/posts/${postId}`)
      .then(res => setPost(res.data))
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false));
  }, [postId]);

  // Real-time placeholder
  useEffect(() => {
    // Connect with socket.io client for live comments/answers
    // socket.emit('join_post', postId);
    // socket.on('new_answer', (data) => updateAnswers(data));
  }, [postId]);

  const handlePostAnswer = async () => {
    if (!answerText.trim()) return;
    setPostingAnswer(true);
    try {
      const res = await axios.post(`/api/posts/${postId}/answer`, { description: answerText, codeSnippet: answerCode }, { withCredentials: true });
      setPost(post => ({ ...post, answers: res.data }));
      setAnswerText('');
      setAnswerCode('');
    } finally {
      setPostingAnswer(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, { commentText }, { withCredentials: true });
      setPost(post => ({ ...post, comments: res.data }));
      setCommentText('');
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="grid grid-cols-12 min-h-screen bg-slate-900 text-white">
      {/* Sidebar Left */}
      <div className="col-span-2 hidden md:block"><Sidebar /></div>
      {/* Main Post Content */}
      <main className="col-span-12 md:col-span-6 flex flex-col items-center py-8 px-2">
        <section className="w-full max-w-2xl bg-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <img src={post.author?.profilePicture || 'https://placehold.co/40x40?text=U'} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-cyan-400" />
            <div>
              <div className="font-bold text-cyan-400">{post.author?.username}</div>
              <div className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</div>
            </div>
            <span className="ml-auto text-xs px-2 py-1 bg-slate-700 rounded-full">{post.category}</span>
            <span className="ml-2">
              {post.bookmarkedBy && post.bookmarkedBy.length > 0 ? <BookmarkCheck className="text-cyan-400" /> : <Bookmark className="text-slate-400" />}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-4">{post.title}</h1>
          <p className="text-slate-300 mb-4 whitespace-pre-line">{post.description}</p>
          {post.codeSnippet && (
            <div className="mb-6 relative">
              <SyntaxHighlighter language="cpp" style={oneDark} customStyle={{ borderRadius: '0.75rem', fontSize: '0.95em', background: '#0f172a' }}>
                {post.codeSnippet}
              </SyntaxHighlighter>
              <button className="absolute top-2 right-2 text-cyan-400 hover:text-cyan-300" title="Copy code" onClick={() => {navigator.clipboard.writeText(post.codeSnippet)}}>
                <Copy size={18} />
              </button>
            </div>
          )}
        </section>
      </main>
      {/* Interaction Panel */}
      <aside className="fixed right-0 top-0 h-screen w-full md:w-[28vw] max-w-md bg-slate-800 p-4 rounded-l-2xl shadow-xl flex flex-col z-30 md:mr-0" style={{ minWidth: 320 }}>
        <Tabs
          active={tab}
          setActive={setTab}
          tabs={[{ title: 'Answers', icon: <Brain size={18} /> }, { title: 'Comments', icon: <MessageSquare size={18} /> }]}
        />
        {tab === 'Answers' ? (
          <div className="flex flex-col h-full min-h-0">
            <h2 className="text-lg font-bold text-green-400 mb-2">Answers</h2>
            <div className="flex-1 overflow-y-auto min-h-0 mb-2" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {post.answers && post.answers.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {post.answers.map((a, i) => (
                    <div key={i} className="bg-slate-900 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={a.userId?.profilePicture || 'https://placehold.co/24x24?text=U'} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-slate-100">{a.userId?.username || 'User'}</span>
                        <span className="ml-auto text-slate-500 text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</span>
                      </div>
                      <div className="text-slate-100 mb-1">{a.description}</div>
                      {a.codeSnippet && (
                        <SyntaxHighlighter language="cpp" style={oneDark} customStyle={{ borderRadius: '0.5rem', fontSize: '0.9em', background: '#1e293b' }}>
                          {a.codeSnippet}
                        </SyntaxHighlighter>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <ThumbsUp size={16} className="text-slate-400 hover:text-cyan-400 cursor-pointer" />
                        <span className="text-xs text-slate-400">0</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-slate-500 text-sm">No answers yet.</div>}
            </div>
            {/* Answer input form at bottom */}
            <div className="w-full bg-slate-800 pt-2 pb-4 fixed bottom-0 right-0 md:w-[28vw] max-w-md z-40" style={{ minWidth: 320 }}>
              <textarea
                className="w-full bg-slate-900 rounded p-2 text-slate-100 font-mono mb-2"
                rows={3}
                placeholder="Write your answer..."
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
              />
              <textarea
                className="w-full bg-slate-900 rounded p-2 text-slate-100 font-mono mb-2"
                rows={2}
                placeholder="Code snippet (optional)"
                value={answerCode}
                onChange={e => setAnswerCode(e.target.value)}
              />
              <button
                className="bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-6 rounded-full transition w-full"
                onClick={handlePostAnswer}
                disabled={postingAnswer || !answerText.trim()}
              >
                {postingAnswer ? 'Posting...' : 'Post Answer'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full min-h-0">
            <h2 className="text-lg font-bold text-cyan-400 mb-2">Comments</h2>
            <div className="flex-1 overflow-y-auto min-h-0 mb-2" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {post.comments && post.comments.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {post.comments.map((c, i) => (
                    <div key={i} className="bg-slate-900 rounded-xl p-3 flex items-center gap-2">
                      <img src={c.userId?.profilePicture || 'https://placehold.co/24x24?text=U'} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-slate-100">{c.userId?.username || 'User'}</span>
                      <span className="text-slate-400 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
                      <span className="text-slate-100 ml-2">{c.commentText}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="text-slate-500 text-sm">No comments yet.</div>}
            </div>
            {/* Comment input form at bottom */}
            <div className="w-full bg-slate-800 pt-2 pb-4 fixed bottom-0 right-0 md:w-[28vw] max-w-md z-40 flex gap-2" style={{ minWidth: 320 }}>
              <input
                className="flex-1 bg-slate-900 rounded p-2 text-slate-100"
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded-full transition"
                onClick={handlePostComment}
                disabled={postingComment || !commentText.trim()}
              >
                {postingComment ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default FullPost; 