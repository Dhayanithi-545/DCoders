import React, { useState, useEffect } from 'react';
import {
  User,
  Pencil,
  LogOut,
  Grid,
  Smile,
  Heart,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ NEW

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    bio: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate(); // ✅ NEW
  const api = import.meta.env.BACKEND_URL || 'http://localhost:9001';


  useEffect(() => {
    axios
      .get(`${api}/api/users/me`, { withCredentials: true })
      .then((res) => {
        const safeUser = {
          ...res.data,
          posts: Array.isArray(res.data.posts) ? res.data.posts : []
        };
        setUser(safeUser);
        setEditData({
          username: safeUser.username,
          bio: safeUser.bio || '',
          profilePicture: safeUser.profilePicture || ''
        });
      })
      .catch(() => setUser(null));
  }, []);

  const isOwnProfile = true;

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditData({
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture
    });
    setEditMode(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put('/api/users/me', editData, {
        withCredentials: true
      });
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to save profile');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      navigate('/login'); // ✅ REPLACED
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Error logging out');
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setEditData((prev) => ({ ...prev, profilePicture: url }));
      setUploading(false);
    }, 1000);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 text-gray-800 dark:text-slate-100 py-10 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
        {/* Profile Pic */}
        <div className="relative hover:scale-105 transition-transform">
          <img
            src={user.profilePicture || 'https://placehold.co/160x160?text=User'}
            alt="Profile"
            className="w-40 h-40 rounded-full shadow-md ring-2 ring-indigo-500 object-cover bg-white dark:bg-slate-800"
          />
          {isOwnProfile && (
            <button
              className="absolute bottom-2 right-2 bg-white dark:bg-slate-900 border border-indigo-500 text-indigo-500 p-2 rounded-full shadow hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
              title="Edit profile picture"
              onClick={() => document.getElementById('profile-pic-input').click()}
            >
              <Pencil size={18} />
            </button>
          )}
          <input
            id="profile-pic-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
            disabled={uploading}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-4 justify-between">
            <div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <User size={24} className="text-indigo-500" />
                {user.username}
              </div>
              <div className="text-gray-500 dark:text-slate-400 text-sm">
                {user.email}
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                <button
                  className="border border-indigo-500 text-indigo-500 px-4 py-1 rounded-full text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                  onClick={handleEdit}
                >
                  <Pencil size={16} className="inline mr-1" />
                  Edit Profile
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-semibold hover:bg-red-600 transition"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="inline mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 whitespace-pre-line leading-relaxed text-base text-gray-700 dark:text-slate-200">
            {user.bio}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-indigo-500">Edit Profile</h2>
            <label className="font-semibold">Username</label>
            <input
              className="bg-slate-100 dark:bg-slate-700 rounded px-3 py-2 text-gray-800 dark:text-white outline-none"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
            />
            <label className="font-semibold">Bio</label>
            <textarea
              className="bg-slate-100 dark:bg-slate-700 rounded px-3 py-2 text-gray-800 dark:text-white outline-none min-h-[60px]"
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
            />
            <label className="font-semibold">Profile Picture</label>
            <div className="flex items-center gap-3">
              <img
                src={editData.profilePicture || 'https://placehold.co/64x64?text=User'}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                disabled={uploading}
              />
              {uploading && <span>Uploading...</span>}
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={handleCancel}
                className="border border-gray-400 text-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-indigo-500 text-white px-4 py-2 rounded font-bold hover:bg-indigo-600 disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="w-full max-w-4xl mx-auto mt-12">
        <div className="flex items-center gap-3 mb-6">
          <Grid size={20} className="text-indigo-500" />
          <span className="font-bold text-lg">
            Posts: {user.posts?.length ?? 0}
          </span>
        </div>
        {!user.posts || user.posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Smile size={48} className="text-gray-400 mb-4" />
            <div className="text-gray-500 text-lg">No posts yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {user.posts.map((post) => (
              <div
                key={post._id}
                className="relative group rounded-xl overflow-hidden shadow-md cursor-pointer bg-white dark:bg-slate-900 hover:scale-105 transition-transform"
                onClick={() => navigate(`/post/${post._id}`)} // ✅ REPLACED
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-4 text-white text-lg">
                    <span className="flex items-center gap-1">
                      <Heart size={18} />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={18} />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
