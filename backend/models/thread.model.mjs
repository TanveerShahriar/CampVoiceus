import mongoose from 'mongoose';

// Define the Comment schema
const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Define the Thread schema
const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  comments: { type: [CommentSchema], default: [] },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Thread = mongoose.model('Thread', ThreadSchema);

export default Thread;