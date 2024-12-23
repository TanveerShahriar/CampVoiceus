import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  dueDate: { type: Date },
});

export default mongoose.model("Task", taskSchema);
