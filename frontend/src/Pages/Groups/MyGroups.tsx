import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyGroups: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(response.data.length === 0) {
            setError("You haven't joined any groups yet.");
        }
        setGroups(response.data);
      } catch (err) {
        setError("Failed to fetch your groups.");
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Groups</h1>
      {error && <p className="text-red-500">{error}</p>}
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group._id} className="mb-4 p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold">{group.name}</h2>
            <p className="text-gray-700">{group.description}</p>
            <Link
              to={`/groups/${group._id}`}
              className="text-indigo-600 hover:underline mt-2 block"
            >
              View Posts
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-700">You haven't joined any groups yet.</p>
      )}
    </div>
  );
};

export default MyGroups;
