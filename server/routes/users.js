import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /api/users/me
router.get('/me', authMiddleware, (req, res) => {
  const { username, email, profilePicture, bio, _id } = req.user;
  res.json({ username, email, profilePicture, bio, _id });
});

// PUT /api/users/me
router.put('/me', authMiddleware, async (req, res) => {
  const { username, bio, profilePicture } = req.body;
  try {
    if (!username) return res.status(400).json({ message: 'Username is required' });
    req.user.username = username;
    req.user.bio = bio || req.user.bio;
    req.user.profilePicture = profilePicture || req.user.profilePicture;
    await req.user.save();
    res.json({ message: 'Profile updated', user: {
      username: req.user.username,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      bio: req.user.bio,
      _id: req.user._id
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 