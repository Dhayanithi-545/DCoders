import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const commentSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const answerSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  codeSnippet: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  codeSnippet: { type: String },
  category: {
    type: String,
    enum: ['Java', 'C++', 'C', 'MERN', 'Python', 'Others'],
    required: true,
  },
  author: { type: Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: Types.ObjectId, ref: 'User' }],
  bookmarkedBy: [{ type: Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now },
});

const Post = model('Post', postSchema);
export default Post; 