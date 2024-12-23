import React, { useState } from "react";
import axios from "axios";
import SharedInput from "../../components/SharedInput";

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/create`,
        { groupName, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage(response.data.message || "Group created successfully!");
      setGroupName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Create Group</h1>
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      <form onSubmit={handleCreateGroup}>
        <SharedInput
          label="Group Name"
          name="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter the group name"
          required
        />
        <SharedInput
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description"
          textarea
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
