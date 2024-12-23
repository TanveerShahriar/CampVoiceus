// controllers/group.controller.mjs
import Group from "../models/group.model.mjs";
import Task from "../models/task.model.mjs";

// Create a group
export const createGroup = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newGroup = new Group({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: "Leader" }],
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Fetch all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("createdBy", "name").populate("members.user", "name");
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Fetch my groups
export const getMyGroups = async (req, res) => {
  try {
    const myGroups = await Group.find({ "members.user": req.user._id }).populate("createdBy", "name");
    res.status(200).json(myGroups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch my groups" });
  }
};

// Join a group
export const joinGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.some((member) => member.user.equals(req.user._id))) {
      group.members.push({ user: req.user._id, role: "Member" });
      await group.save();
    }

    res.status(200).json({ message: "Joined group successfully", group });
  } catch (err) {
    res.status(500).json({ error: "Failed to join group" });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.messages.push({ sender: req.user._id, content });
    await group.save();

    res.status(201).json({ message: "Message sent successfully", group });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Fetch messages
export const getMessages = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId).populate("messages.sender", "name");
    if (!group) return res.status(404).json({ error: "Group not found" });

    res.status(200).json(group.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Post an update
export const postUpdate = async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.updates.push({ content, author: req.user._id });
    await group.save();

    res.status(201).json({ message: "Update posted successfully", group });
  } catch (err) {
    res.status(500).json({ error: "Failed to post update" });
  }
};

// Fetch updates
export const getUpdates = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId).populate("updates.author", "name");
    if (!group) return res.status(404).json({ error: "Group not found" });

    res.status(200).json(group.updates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch updates" });
  }
};

// Create a task
export const createTask = async (req, res) => {
  const { groupId } = req.params;
  const { title, description, assignedTo, dueDate } = req.body;

  try {
    const task = new Task({ projectId: groupId, title, description, assignedTo, dueDate });
    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Fetch tasks
export const getTasks = async (req, res) => {
  const { groupId } = req.params;
  try {
    const tasks = await Task.find({ projectId: groupId }).populate("assignedTo", "name");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
