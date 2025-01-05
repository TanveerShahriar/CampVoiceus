import React, { useEffect, useState } from "react";
import axios from "axios";
import HomeThread from "../Pages/Home/HomeThread";

interface Thread {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  comments: {
    commentId: string;
    userId: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    userName: string;
  }[];
  upvotes: string[];
  downvotes: string[];
  file?: {
    name: string;
    contentType: string;
    data: ArrayBuffer;
  };
}

interface UserThreadsProps {
  userId: string;
}

const UserThreads: React.FC<UserThreadsProps> = ({ userId }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserThreads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/threads/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setThreads(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user threads:", error);
        setLoading(false);
      }
    };

    fetchUserThreads();
  }, [userId]);

  if (loading) return <div className="text-center">Loading threads...</div>;

  return (
    <div className="space-y-4">
        {threads.map((thread) => (
          <HomeThread key={thread._id} thread={thread} />
        ))}
      </div>
  );
};

export default UserThreads;
