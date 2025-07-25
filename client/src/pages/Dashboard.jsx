import React, { useEffect, useState } from 'react';
import {
  Home,
  PlusCircle,
  UserCircle,
  Bookmark,
  Menu,
  X
} from 'lucide-react';
import PostFeed from '../components/PostFeed';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9001'; // or your deployed backend URL
axios.defaults.withCredentials = true;

const navItems = [
  { label: 'Home', icon: Home, to: '/dashboard' },
  { label: 'New Post', icon: PlusCircle, to: '/create' },
  { label: 'My Profile', icon: UserCircle, to: '/profile' },
  { label: 'Bookmarks', icon: Bookmark, to: '/bookmarks' },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('Home');
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:9001/api/users/me', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className={`sticky top-0 bg-slate-800 transition-all duration-200 ${sidebarOpen ? 'w-full md:w-[260px]' : 'w-16 md:w-16'} flex flex-col min-h-screen z-20`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen && (
            <span className="font-inter text-slate-100 text-sm font-bold">DCoders</span>
          )}
          <button
            className="ml-auto text-slate-100"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {/* Profile Box */}
        <div className={`flex flex-col items-center gap-2 p-4 border-b border-slate-700 transition-all ${sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 p-0'} duration-200`}> 
          {user && (
            <>
              <img
                src={user.profilePicture || 'https://placehold.co/64x64?text=User'}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
              />
              <span className="font-inter text-slate-100 text-base font-semibold">{user.username}</span>
              <span className="font-inter text-slate-400 text-xs">{user.email}</span>
            </>
          )}
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 mt-4">
          {navItems.map(({ label, icon: Icon, to }) => (
            to ? (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-r-full transition-colors font-inter text-sm ${active === label ? 'bg-slate-700 text-cyan-400' : 'hover:bg-slate-700'}`}
                onClick={() => setActive(label)}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{label}</span>}
              </Link>
            ) : (
              <button
                key={label}
                className={`flex items-center gap-3 px-4 py-2 rounded-r-full transition-colors font-inter text-sm ${active === label ? 'bg-slate-700 text-cyan-400' : 'hover:bg-slate-700'}`}
                onClick={() => setActive(label)}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{label}</span>}
              </button>
            )
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="bg-slate-900 p-6 flex flex-col items-center justify-start min-h-screen">
        <h1 className="font-rubik text-2xl text-cyan-400 font-bold text-center mb-6">
          Welcome to DCoders{user ? `, ${user.username}` : ''}
        </h1>
        <PostFeed user={user} />
      </main>
    </div>
  );
};

// PostForm component will be created in the next step
import PostForm from '../components/PostForm';

export default Dashboard; 