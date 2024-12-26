import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostModal from "./PostModal";

const GroupPosts: React.FC = () => {
  const { groupId } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/posts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch group posts.");
      }
    };

    fetchPosts();
  }, [groupId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Group Posts</h1>
      {error && <p className="text-red-500">{error}</p>}
      {posts.length > 0 ? (
        posts.map((post) => <PostModal key={post._id} post={post} groupId={groupId!} />)
      ) : (
        <p className="text-gray-700">No posts available for this group.</p>
      )}
    </div>
  );
};

export default GroupPosts;
