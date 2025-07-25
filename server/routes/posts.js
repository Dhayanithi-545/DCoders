import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createPost,
  getAllPosts,
  getPostsByCategory,
  toggleLike,
  toggleBookmark,
  addComment,
  addAnswer,
  getBookmarkedPosts,
  getPostById
} from '../controllers/postController.js';

const router = express.Router();

// Create new post (professional route)
router.post('/create', authMiddleware, createPost);

// Get all posts
router.get('/', getAllPosts);

// Get posts by category
router.get('/category/:category', getPostsByCategory);

// Get single post by ID
router.get('/:id', getPostById);

// Toggle like (protected)
router.put('/:id/like', authMiddleware, toggleLike);

// Toggle bookmark (protected)
router.put('/:id/bookmark', authMiddleware, toggleBookmark);

// Add comment (protected)
router.post('/:id/comment', authMiddleware, addComment);

// Add answer (protected)
router.post('/:id/answer', authMiddleware, addAnswer);

// View Bookmarked Posts
router.get('/bookmarks/me', authMiddleware, getBookmarkedPosts);

export default router; 