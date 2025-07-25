import React, { useState } from 'react';
import { Code2, Tags } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = ['Java', 'C++', 'C', 'MERN', 'Python', 'Others'];

const CreatePost = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    codeSnippet: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [descCount, setDescCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'description') setDescCount(value.length);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/posts/create',
        form,
        { withCredentials: true }
      );
      setSuccess(true);
      setForm({ title: '', description: '', codeSnippet: '', category: '' });
      setDescCount(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setApiError(err.response?.data?.msg || 'Failed to create post');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <span className="font-orbitron text-4xl text-cyan-400 mb-2 select-none">DCoders</span>
          <h2 className="text-2xl font-bold mb-1">Create a New Post</h2>
          <p className="text-slate-300 text-sm">Share your questions or ideas with the community</p>
        </div>
        {success && (
          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center font-semibold">Post created successfully!</div>
        )}
        {apiError && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center font-semibold">{apiError}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold">Post Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              placeholder="E.g. How to optimize merge sort in C++?"
              value={form.title}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white ${errors.title ? 'border border-red-500' : ''}`}
              required
            />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              rows={5}
              maxLength={500}
              placeholder="Explain your doubt or topic here in detail"
              value={form.description}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white resize-none ${errors.description ? 'border border-red-500' : ''}`}
              required
            />
            <div className="flex justify-between text-xs mt-1">
              {errors.description && <span className="text-red-500">{errors.description}</span>}
              <span className="text-slate-400">{descCount}/500</span>
            </div>
          </div>
          {/* Code Snippet */}
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-2">
              <Code2 size={18} className="text-cyan-400" />
              Code Snippet (Optional)
            </label>
            <textarea
              name="codeSnippet"
              rows={3}
              placeholder="Paste your code here (optional)"
              value={form.codeSnippet}
              onChange={handleChange}
              className="w-full p-4 rounded bg-slate-700 font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
          </div>
          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold flex items-center gap-2">
              <Tags size={18} className="text-cyan-400" />
              Select Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.category ? 'border border-red-500' : ''}`}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
          </div>
          {/* Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={loading || !form.title.trim() || !form.description.trim() || !form.category}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-full transition disabled:opacity-60"
            >
              {loading ? 'Posting...' : 'Post Question'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="border border-slate-400 text-slate-400 px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 