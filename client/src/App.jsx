import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Bookmarks from './pages/Bookmarks';
import CreatePost from './pages/CreatePost';
import FullPost from './pages/FullPost';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:postId" element={<FullPost />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Add /dashboard and other routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
