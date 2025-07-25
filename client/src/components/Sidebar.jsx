import React, { useState } from 'react';
import { Home, PlusCircle, FolderKanban, UserCircle, Bookmark, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', icon: Home, to: '/dashboard' },
  { label: 'New Post', icon: PlusCircle, to: '/create' },
  { label: 'My Posts', icon: FolderKanban, to: '/myposts' },
  { label: 'Profile', icon: UserCircle, to: '/profile' },
  { label: 'Bookmarks', icon: Bookmark, to: '/bookmarks' },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <aside className={`sticky top-0 h-screen bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-200 ${open ? 'w-56' : 'w-16'} z-20`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {open && <span className="font-orbitron text-cyan-400 text-2xl font-bold select-none">DCoders</span>}
        <button className="ml-auto text-slate-100" onClick={() => setOpen(v => !v)} aria-label="Toggle sidebar">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {navItems.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-r-full transition-colors font-inter text-sm ${location.pathname === to ? 'bg-slate-700 text-cyan-400' : 'hover:bg-slate-700'} ${open ? '' : 'justify-center'}`}
          >
            <Icon size={20} />
            {open && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 