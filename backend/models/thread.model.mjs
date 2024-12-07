import mongoose from 'mongoose';

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
  comments: { type: [CommentSchema], default: [] },
  upvotes: { type: [String], default: [] }, // Array of userIds who upvoted the thread
  downvotes: { type: [String], default: [] }, // Array of userIds who downvoted the thread
  createdAt: { type: Date, default: Date.now },
});

const Thread = mongoose.model('Thread', ThreadSchema);

export default Thread;