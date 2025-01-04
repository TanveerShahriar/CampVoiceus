import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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

export default function ThreadDetails() {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/threads/getthreadbyid`,
          { id: threadId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setThread(response.data.thread);
      } catch (error) {
        console.error("Error fetching thread details:", error);
      }
    };

    if (threadId) {
      fetchThread();
    }
  }, [threadId]);

  if (!thread || !thread.upvotes || !thread.downvotes) {
    return <div className="text-center text-gray-500">Loading thread details...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <HomeThread thread={thread} />
    </div>
  );
}
