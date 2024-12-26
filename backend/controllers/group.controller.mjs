import { Group, Post } from "../models/group.model.mjs";
import User from "../models/user.model.mjs";

export const createGroup = async (req, res) => {
  const { name, description } = req.body;
  const creatorId = req.user.id; // Ensure `requireAuth` middleware attaches user ID

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const group = new Group({
      name : name,
      description : description,
      createdBy: creatorId,
      members: [creatorId], // Add the creator as the first member
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
};


export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("createdBy", "name username");

    if (!groups.length) {
      return res.status(404).json({ message: "No groups found." });
    }

    
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching all groups:", error);
    res.status(500).json({ error: "Failed to fetch groups." });
  }
};


export const joinGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Error joining group." });
  }
};


export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // Find the group and remove the user from its members
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ error: "You are not a member of this group" });
    }

    group.members = group.members.filter((member) => member.toString() !== userId);
    await group.save();

    res.status(200).json({ message: "Left the group successfully" });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ error: "Failed to leave the group" });
  }
};




export const createPost = async (req, res) => {
  const { groupId } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id; // Ensure `requireAuth` middleware attaches the user ID

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    // Verify that the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    console.log("Group ID:", groupId);
console.log("Request Body:", req.body);
console.log("User ID:", userId);
    // Create a new post
    const post = new Post({
      title,
      content,
      author: userId,
      group: groupId,
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully.", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
};


export const getGroupPosts = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Fetch all posts for the specified group
    const posts = await Post.find({ group: groupId }).populate("author", "name username");

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this group." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching group posts:", error);
    res.status(500).json({ error: "Failed to fetch group posts." });
  }
};

export const getPostDetails = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("author", "name username")
      .populate("comments.author", "name username");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post details." });
  }
};

export const interactWithPost = async (req, res) => {
  const { postId } = req.params;
  const { action, content } = req.body;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (action === "upvote") {
      if (!post.upvotes.includes(userId)) {
        post.upvotes.push(userId);
        post.downvotes = post.downvotes.filter((id) => id.toString() !== userId.toString());
      }
    } else if (action === "downvote") {
      if (!post.downvotes.includes(userId)) {
        post.downvotes.push(userId);
        post.upvotes = post.upvotes.filter((id) => id.toString() !== userId.toString());
      }
    } else if (action === "comment") {
      post.comments.push({ content, author: userId });
    }

    await post.save();
    const updatedPost = await Post.findById(postId)
      .populate("author", "name username")
      .populate("comments.author", "name username");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Error interacting with post." });
  }
};


export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id; // `req.user` is populated by the `requireAuth` middleware

    // Find all groups where the user is a member
    const myGroups = await Group.find({ members: userId });

    if (!myGroups.length) {
      return res.status(404).json({ message: "No groups found." });
    }

    res.status(200).json(myGroups);
  } catch (error) {
    console.error("Error fetching user's groups:", error);
    res.status(500).json({ message: "Failed to fetch user's groups." });
  }
};

export const upvotePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    const post = await Post.findById(postId);
    if (post.upvotes.includes(userId)) {
      return res.status(400).json({ error: "Already upvoted." });
    }
    post.upvotes.push(userId);
    await post.save();
    res.status(200).json({ updatedPost: post });
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote post." });
  }
};

export const downvotePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    const post = await Post.findById(postId);
    if (post.downvotes.includes(userId)) {
      return res.status(400).json({ error: "Already downvoted." });
    }
    post.downvotes.push(userId);
    await post.save();
    res.status(200).json({ updatedPost: post });
  } catch (error) {
    res.status(500).json({ error: "Failed to downvote post." });
  }
};