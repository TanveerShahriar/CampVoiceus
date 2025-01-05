import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import VotesModal from "../Pages/Home/VotesModal";
import CommentModal from "../Pages/Home/CommentModal";
import { Thread } from "./types";
import { jwtDecode } from "jwt-decode";
import { formatDate } from "../utils/dateFormatter";

interface ThreadWithCommentsProps {
  thread: Thread;
}

interface DecodedToken {
  id: string;
  email: string;
}

const ThreadWithComments: React.FC<ThreadWithCommentsProps> = ({ thread }) => {
  const [stateThread, setStateThread] = useState<Thread>(thread);
  const [newComment, setNewComment] = useState<string>("");
  const [isUpvoteModalOpen, setIsUpvoteModalOpen] = useState<boolean>(false);
  const [isDownvoteModalOpen, setIsDownvoteModalOpen] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);
    } else {
      console.error("No token found");
    }

    const enrichThreadAuthor = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        if (!stateThread.authorInfo) {
          const authorResponse = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
            { id: stateThread.authorId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setStateThread((prevThread) => ({
            ...prevThread,
            authorInfo: {
              _id: authorResponse.data._id,
              name: authorResponse.data.name,
              username: authorResponse.data.username,
              avatarUrl: authorResponse.data.avatarUrl,
            },
          }));
        }
      } catch (error) {
        console.error("Error enriching thread author info:", error);
      }
    };

    enrichThreadAuthor();
  }, [stateThread]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/comment`,
        { threadId: stateThread._id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.thread) {
        setStateThread(response.data.thread);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderContentWithLineBreaks = (content: string) => {
    return { __html: content.replace(/\n/g, "<br/>") };
  };

  const handleUpvote = async (threadId: string) => {
    const token = localStorage.getItem("token");
    const upvoteData = {
      threadId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/upvote`,
        upvoteData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { updatedThread } = response.data;

      setStateThread((prevThread) => ({
        ...updatedThread,
        authorInfo: prevThread.authorInfo,
      }));
    } catch (err: any) {
      console.log("error");
    }
  };

  const handleDownvote = async (threadId: string) => {
    const token = localStorage.getItem("token");
    const downvoteData = {
      threadId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/downvote`,
        downvoteData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { updatedThread } = response.data;

      setStateThread((prevThread) => ({
        ...updatedThread,
        authorInfo: prevThread.authorInfo,
      }));
    } catch (err: any) {
      console.log("error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Thread Details */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/profile/${stateThread.authorInfo?.username}`}
            className="flex items-center group"
          >
            <img
              src={
                stateThread.authorInfo?.avatarUrl || "/placeholderCropped.png"
              }
              alt={`${stateThread.authorInfo?.name}'s avatar`}
              className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"
            />
            <div>
              <p className="font-semibold text-sm group-hover:text-indigo-600 transition-colors duration-300">
                {stateThread.authorInfo?.name}
              </p>
              <p className="text-gray-500 text-xs group-hover:text-indigo-400 transition-colors duration-300">
                @{stateThread.authorInfo?.username}
              </p>
            </div>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-indigo-600 mb-4 transition-colors duration-300 hover:text-indigo-700">
          {stateThread.title}
        </h2>
        <p
          className="text-gray-700 mb-6 leading-relaxed"
          dangerouslySetInnerHTML={renderContentWithLineBreaks(
            stateThread.content
          )}
        ></p>

        {/* Thread Voting */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleUpvote(stateThread._id)}
              disabled={stateThread.upvotes.includes(userId)}
              className={`py-2 px-4 rounded-xl transition-all duration-300 ${
                stateThread.upvotes.includes(userId)
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white"
              }`}
            >
              ▲
            </button>
            <button
              onClick={() => setIsUpvoteModalOpen(true)}
              className="py-2 px-4 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
            >
              {stateThread.upvotes.length}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownvote(stateThread._id)}
              disabled={stateThread.downvotes.includes(userId)}
              className={`py-2 px-4 rounded-xl transition-all duration-300 ${
                stateThread.downvotes.includes(userId)
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
              }`}
            >
              ▼
            </button>
            <button
              onClick={() => setIsDownvoteModalOpen(true)}
              className="py-2 px-4 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
            >
              {stateThread.downvotes.length}
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2 ml-1">
          {formatDate(stateThread.createdAt)}
        </div>
      </div>

      <VotesModal
        voteType="Upvotes"
        votes={stateThread.upvotes}
        isOpenState={[isUpvoteModalOpen, setIsUpvoteModalOpen]}
      />
      <VotesModal
        voteType="Downvotes"
        votes={stateThread.downvotes}
        isOpenState={[isDownvoteModalOpen, setIsDownvoteModalOpen]}
      />

      {/* Comments */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Comments</h3>
        <div className="space-y-6">
          {stateThread.comments.map((comment) => (
            <CommentModal
              key={comment.commentId}
              comment={comment}
              threadId={stateThread._id}
            />
          ))}
          {stateThread.comments.length === 0 && (
            <p className="text-gray-600 italic">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {/* Add Comment */}
        <div className="flex items-center mt-8">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddComment}
            className="bg-indigo-500 text-white px-6 py-3 rounded-r-md hover:bg-indigo-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadWithComments;
