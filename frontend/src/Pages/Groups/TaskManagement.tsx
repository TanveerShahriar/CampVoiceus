import React, { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: { name: string };
  status: string;
  dueDate: string;
}

const TaskManagement: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [groupId]);

  const handleCreateTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/task`,
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prev) => [...prev, response.data.task]);
      setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/tasks/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-xl font-bold mb-4">Task Management</h1>
      <div className="mb-4">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 border-b">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>
              Assigned to:{" "}
              {task.assignedTo ? task.assignedTo.name : "Unassigned"}
            </p>
            <p>Status: {task.status}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <div className="mt-2">
              {["Pending", "In Progress", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(task._id, status)}
                  className={`px-2 py-1 mr-2 rounded-md ${
                    task.status === status
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Create New Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-2"
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-2"
        ></textarea>
        <input
          type="text"
          placeholder="Assign To (User ID)"
          value={newTask.assignedTo}
          onChange={(e) =>
            setNewTask({ ...newTask, assignedTo: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) =>
            setNewTask({ ...newTask, dueDate: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-2"
        />
        <button onClick={handleCreateTask} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskManagement;
