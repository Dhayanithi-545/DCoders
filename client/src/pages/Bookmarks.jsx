import React, { useEffect, useState } from 'react';
import PostFeed from '../components/PostFeed';

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:9001/api/users/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
    fetch('http://localhost:9001/api/posts/bookmarks/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <h1 className="font-rubik text-2xl text-cyan-400 font-bold text-center mb-6">Bookmarked Posts</h1>
      <PostFeed user={user} posts={posts} />
    </div>
  );
};

export default Bookmarks; 