import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import VotesModal from "../Pages/Home/VotesModal";
import CommentsModal from "../Pages/Home/CommentsModal";

interface Comment {
  commentId: string;
  userId: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  userName: string;
}

interface AuthorInfo {
  name: string;
  username: string;
  avatarUrl: string;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorInfo?: AuthorInfo;
  upvotes: string[];
  downvotes: string[];
  comments: Comment[];
  createdAt: string;
}

interface UserThreadsProps {
  userId: string;
}

interface DecodedToken {
  id: string;
  email: string;
}

const UserThreads: React.FC<UserThreadsProps> = ({ userId }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isOpenUpvote, setIsOpenUpvote] = useState<boolean>(false);
  const [isOpenDownvote, setIsOpenDownvote] = useState<boolean>(false);
  const [isOpenComment, setIsOpenComment] = useState<boolean>(false);
  const [currentThreadId, setCurrentThreadId] = useState<string>("");

  const fetchUserInfo = async (authorId: string): Promise<AuthorInfo> => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
        { id: authorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        name: response.data.name,
        username: response.data.username,
        avatarUrl: response.data.avatarUrl,
      };
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { name: "Unknown", username: "unknown", avatarUrl: "" };
    }
  };

  useEffect(() => {
    const fetchUserThreads = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          setCurrentUserId(decoded.id);
        }
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/threads/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const threadsWithAuthorInfo = await Promise.all(
          response.data.map(async (thread: Thread) => {
            const authorInfo = await fetchUserInfo(thread.authorId);
            return { ...thread, authorInfo };
          })
        );
        setThreads(threadsWithAuthorInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user threads:", error);
        setLoading(false);
      }
    };

    fetchUserThreads();
  }, [userId]);

  const handleVote = async (
    threadId: string,
    voteType: "upvote" | "downvote"
  ) => {
    const token = localStorage.getItem("token");
    const voteData = {
      [voteType === "upvote" ? "upvoter" : "downvoter"]: token,
      threadId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/${voteType}`,
        voteData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { updatedThread } = response.data;
      setThreads(
        threads.map((thread) =>
          thread._id === updatedThread._id
            ? { ...updatedThread, authorInfo: thread.authorInfo }
            : thread
        )
      );
    } catch (err) {
      console.error(`Error ${voteType}ing:`, err);
    }
  };

  const handleOpenModal = (
    modalType: "upvote" | "downvote" | "comment",
    threadId: string
  ) => {
    setCurrentThreadId(threadId);
    if (modalType === "upvote") setIsOpenUpvote(true);
    else if (modalType === "downvote") setIsOpenDownvote(true);
    else if (modalType === "comment") setIsOpenComment(true);
  };

  if (loading) return <div className="text-center">Loading threads...</div>;

  return (
    <div className="space-y-6">
      {threads.map((thread) => (
        <div
          key={thread._id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <img
                src={
                  thread.authorInfo?.avatarUrl ||
                  "/placeholder.png?height=40&width=40"
                }
                alt={`${thread.authorInfo?.name}'s avatar`}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-semibold text-sm">
                  {thread.authorInfo?.name}
                </p>
                <p className="text-gray-500 text-xs">
                  @{thread.authorInfo?.username}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {thread.title}
              </h3>
              <p className="text-gray-600">{thread.content}</p>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleVote(thread._id, "upvote")}
                  className={`flex items-center space-x-1 ${
                    thread.upvotes.includes(currentUserId)
                      ? "text-blue-500"
                      : ""
                  }`}
                >
                  <ArrowBigUp className="w-5 h-5" />
                  <span>{thread.upvotes.length}</span>
                </button>
                <button
                  onClick={() => handleVote(thread._id, "downvote")}
                  className={`flex items-center space-x-1 ${
                    thread.downvotes.includes(currentUserId)
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  <ArrowBigDown className="w-5 h-5" />
                  <span>{thread.downvotes.length}</span>
                </button>
                <button
                  onClick={() => handleOpenModal("comment", thread._id)}
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{thread.comments.length}</span>
                </button>
              </div>
              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
      {isOpenUpvote && (
        <VotesModal
          voteType="Upvotes"
          votes={threads.find((t) => t._id === currentThreadId)?.upvotes || []}
          isOpenState={[isOpenUpvote, setIsOpenUpvote]}
        />
      )}
      {isOpenDownvote && (
        <VotesModal
          voteType="Downvotes"
          votes={
            threads.find((t) => t._id === currentThreadId)?.downvotes || []
          }
          isOpenState={[isOpenDownvote, setIsOpenDownvote]}
        />
      )}
      {isOpenComment && (
        <CommentsModal
          isOpenState={[isOpenComment, setIsOpenComment]}
          threadId={currentThreadId}
        />
      )}
    </div>
  );
};

export default UserThreads;
