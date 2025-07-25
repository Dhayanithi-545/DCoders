import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import devBigIllustration from '../assets/devBigillustration.png';

const Login = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:9001/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-slate-800">
        <img src={devBigIllustration} alt="Dev Illustration" className="max-w-xs mx-auto" />
      </div>
      {/* Right Side */}
      <div className="flex flex-col w-full md:w-1/2 items-center justify-center relative p-8">
        {/* Logo */}
        <div className="absolute top-8 right-8 font-mono font-bold text-cyan-400 text-2xl select-none">
          DCoders
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
          <h2 className="text-3xl font-bold mb-2 text-center">Log In</h2>
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-2 text-center">
              {error}
            </div>
          )}
          <div className="flex items-center gap-2 bg-slate-700 rounded px-3 py-2">
            <User className="text-cyan-400" size={20} />
            <input
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={form.identifier}
              onChange={handleChange}
              className="bg-transparent outline-none flex-1 text-slate-100 placeholder:text-slate-400"
              autoComplete="username"
              required
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-700 rounded px-3 py-2">
            <Lock className="text-cyan-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-transparent outline-none flex-1 text-slate-100 placeholder:text-slate-400"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold py-2 rounded transition-colors mt-2"
          >
            Log In to DCoders
          </button>
          <div className="text-center mt-2 text-slate-400">
            Don’t have an account?{' '}
            <a href="/signup" className="text-cyan-400 hover:underline font-semibold">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 