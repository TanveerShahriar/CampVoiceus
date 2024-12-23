import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupUpdates: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [newUpdate, setNewUpdate] = useState("");

  useEffect(() => {
    const fetchUpdates = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/updates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpdates(response.data);
      } catch (err) {
        console.error("Failed to fetch updates:", err);
      }
    };

    fetchUpdates();
  }, [groupId]);

  const handlePostUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/update`,
        { content: newUpdate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUpdates((prev) => [
        ...prev,
        { content: newUpdate, author: { name: "You" }, timestamp: new Date().toISOString() },
      ]);
      setNewUpdate("");
    } catch (err) {
      console.error("Failed to post update:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-xl font-bold mb-4">Group Updates</h1>
      <div className="mb-4">
        {updates.map((update, index) => (
          <div key={index} className="p-2 border-b">
            <strong>{update.author.name}:</strong> {update.content}
            <div className="text-sm text-gray-500">
              {new Date(update.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <textarea
        value={newUpdate}
        onChange={(e) => setNewUpdate(e.target.value)}
        className="w-full p-2 border rounded-md"
        placeholder="Post an update..."
      ></textarea>
      <button onClick={handlePostUpdate} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">
        Post Update
      </button>
    </div>
  );
};

export default GroupUpdates;
