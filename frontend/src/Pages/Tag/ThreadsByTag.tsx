import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HomeThread from "../Home/HomeThread";

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

const ThreadsByTag: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tag) {
        console.error("Tag is undefined.");
        return;
      }
      
    const fetchThreadsByTag = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/threads/filterbytag/${encodeURIComponent(tag)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setThreads(response.data.threads || []);
      } catch (error) {
        console.error("Error fetching threads by tag:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchThreadsByTag();
    }
  }, [tag]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading threads for #{tag}...</div>;
  }

  if (!threads.length) {
    return <div className="text-center text-gray-500">No threads found for #{tag}.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-600">#{tag}</h1>
      <div className="space-y-4">
        {threads.map((thread) => (
          <HomeThread key={thread._id} thread={thread} />
        ))}
      </div>
    </div>
  );
};

export default ThreadsByTag;
