import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './utils/auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Bookmarks from './pages/Bookmarks';
import CreatePost from './pages/CreatePost';
import FullPost from './pages/FullPost';
import Profile from './pages/Profile';
import ProtectedLayout from './components/ProtectedLayout';

function App() {
  const token = getToken();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:postId" element={<FullPost />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
