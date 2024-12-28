import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyGroups: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(response.data);
      } catch (err) {
        setError("Failed to fetch your groups.");
      }
    };

    fetchGroups();
  }, []);

  const handleViewGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Groups</h1>
      {error && <p className="text-red-500">{error}</p>}
      {groups.map((group) => (
        <div key={group._id} className="mb-4 p-4 bg-white rounded shadow-md">
          <h2
            className="text-lg font-bold text-indigo-600 hover:underline cursor-pointer"
            onClick={() => handleViewGroup(group._id)}
          >
            {group.name}
          </h2>
          <p className="text-gray-700">{group.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MyGroups;
