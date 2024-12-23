import React, { useEffect, useState } from "react";
import axios from "axios";
import GroupCard from "../../components/GroupCard";

interface Group {
  _id: string;
  groupName: string;
  description: string;
  members: string[];
}

const MyGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyGroups = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/groups/mygroups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching my groups:", error);
        alert("Failed to load your groups. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">My Groups</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group._id}
              groupName={group.groupName}
              description={group.description}
              memberCount={group.members.length}
              isJoined
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
