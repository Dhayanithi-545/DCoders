import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /api/users/me
router.get('/me', authMiddleware, (req, res) => {
  const { username, email, profilePicture, bio, _id } = req.user;
  res.json({ username, email, profilePicture, bio, _id });
});

export default router; 