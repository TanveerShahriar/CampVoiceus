import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ThreadWithComments from "./ThreadWithComments";
import { Thread } from "./types";

export default function ThreadDetails() {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching thread details:", error);
        setError("Failed to load thread details. Please try again later.");
        setLoading(false);
      }
    };

    if (threadId) {
      fetchThread();
    }
  }, [threadId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg max-w-2xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center text-gray-500 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto mt-8">
        Thread not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ThreadWithComments thread={thread} />
    </div>
  );
}
