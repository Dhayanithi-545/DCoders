import Post from '../models/Post.js';

// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, description, codeSnippet, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    const post = await Post.create({
      title,
      description,
      codeSnippet,
      category,
      author: req.user._id || req.user.id,
    });
    const populatedPost = await post.populate('author', 'username profilePicture');
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all posts, sorted by latest
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get posts by category
export const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ category })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle like
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user._id;
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookmarked posts for current user
export const getBookmarkedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ bookmarkedBy: req.user._id })
      .populate('author', 'username profilePicture')
      .populate('comments.userId', 'username profilePicture')
      .populate('answers.userId', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user._id;
    const index = post.bookmarkedBy.indexOf(userId);
    let bookmarked;
    if (index === -1) {
      post.bookmarkedBy.push(userId);
      bookmarked = true;
    } else {
      post.bookmarkedBy.splice(index, 1);
      bookmarked = false;
    }
    await post.save();
    res.json({ bookmarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ userId: req.user._id, commentText });
    await post.save();
    await post.populate('comments.userId', 'username profilePicture');
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add answer
export const addAnswer = async (req, res) => {
  try {
    const { description, codeSnippet } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.answers.push({ userId: req.user._id, description, codeSnippet });
    await post.save();
    await post.populate('answers.userId', 'username profilePicture');
    res.status(201).json(post.answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture email')
      .populate('answers.userId', 'username profilePicture')
      .populate('comments.userId', 'username profilePicture');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
}; 