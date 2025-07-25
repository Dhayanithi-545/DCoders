import React, { useState } from 'react';

const categories = ['Java', 'C++', 'C', 'MERN', 'Python', 'Others'];

const PostForm = ({ onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    codeSnippet: '',
    category: categories[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:9001/api/posts/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create post');
      }
      onClose();
      window.location.reload(); // quick refresh for now
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="bg-red-500 text-white px-3 py-2 rounded">{error}</div>}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="bg-slate-700 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="bg-slate-700 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none min-h-[80px]"
        required
      />
      <textarea
        name="codeSnippet"
        placeholder="Code Snippet (optional)"
        value={form.codeSnippet}
        onChange={handleChange}
        className="bg-slate-700 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 outline-none font-mono min-h-[60px]"
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="bg-slate-700 rounded px-3 py-2 text-slate-100 outline-none"
        required
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-slate-600 text-slate-100 hover:bg-slate-700">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-500 disabled:opacity-60">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm; 