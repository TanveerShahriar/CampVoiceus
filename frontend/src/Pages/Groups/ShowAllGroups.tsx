import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowAllGroups: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const allGroupsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/groups/allgroups`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const joinedGroupsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/groups/mine`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setGroups(allGroupsResponse.data);
        setJoinedGroups(joinedGroupsResponse.data.map((group: any) => group._id));
      } catch (err) {
        setError("Failed to fetch groups.");
      }
    };

    fetchGroups();
  }, []);

  const handleJoin = async (groupId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJoinedGroups((prev) => [...prev, groupId]);
      alert("Joined group successfully!");
    } catch (error) {
      alert("Failed to join the group.");
    }
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Groups</h1>
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
          <button
            onClick={() => handleJoin(group._id)}
            disabled={joinedGroups.includes(group._id)}
            className={`mt-2 px-4 py-2 rounded ${
              joinedGroups.includes(group._id) ? "bg-gray-400 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {joinedGroups.includes(group._id) ? "Joined" : "Join Group"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShowAllGroups;
