import React, { useState, useEffect } from 'react';
import {
  Home,
  PlusCircle,
  UserCircle,
  Bookmark,
  Menu,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import PostFeed from '../components/PostFeed';
import PostForm from '../components/PostForm'; // ✅ Correctly placed at the top

const navItems = [
  { label: 'Home', icon: Home, to: '/dashboard' },
  { label: 'New Post', icon: PlusCircle, to: '/create' },
  { label: 'Profile', icon: UserCircle, to: '/profile' },
  { label: 'Bookmarks', icon: Bookmark, to: '/bookmarks' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState('Home');

  // ✅ Redirect to login if no token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 bg-slate-800 transition-all duration-200 ${
          sidebarOpen ? 'w-full md:w-[260px]' : 'w-16 md:w-16'
        } flex flex-col min-h-screen z-20`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen && (
            <span className="font-inter text-slate-100 text-sm font-bold">DCoders</span>
          )}
          <button
            className="ml-auto text-slate-100"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Optional: Profile section */}
        <div
          className={`flex flex-col items-center gap-2 p-4 border-b border-slate-700 transition-all ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 p-0'
          } duration-200`}
        >
          {/* Profile picture & username (optional) */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 mt-4">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded-r-full transition-colors font-inter text-sm ${
                active === label ? 'bg-slate-700 text-cyan-400' : 'hover:bg-slate-700'
              }`}
              onClick={() => setActive(label)}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="font-rubik text-2xl text-cyan-400 font-bold mb-6">
          Welcome to DCoders
        </h1>
        <PostFeed />
        {/* Optionally include <PostForm /> here if needed */}
      </main>
    </div>
  );
};

export default Dashboard;
