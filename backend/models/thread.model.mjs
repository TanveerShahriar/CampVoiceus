import mongoose from 'mongoose';
import { User } from './index.mjs'

// Define the Comment schema
const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: [String], default: [] }, // Array of userIds who upvoted the comment
  downvotes: { type: [String], default: [] }, // Array of userIds who downvoted the comment
  createdAt: { type: Date, default: Date.now },
});

// Define the Thread schema
const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String }, // New field to store authorName
  comments: { type: [CommentSchema], default: [] },
  upvotes: { type: [String], default: [] }, // Array of userIds who upvoted the thread
  downvotes: { type: [String], default: [] }, // Array of userIds who downvoted the thread
  createdAt: { type: Date, default: Date.now },
});

// Pre-save middleware to populate authorName from User model
ThreadSchema.pre('save', async function (next) {
  if (this.isModified('authorId') || !this.authorName) {
    try {
      const user = await User.findById(this.authorId);
      this.authorName = user ? user.name : 'Unknown';
    } catch (error) {
      console.error('Error fetching author name:', error);
      this.authorName = 'Unknown';
    }
  }
  next();
});

const Thread = mongoose.model('Thread', ThreadSchema);

export default Thread;