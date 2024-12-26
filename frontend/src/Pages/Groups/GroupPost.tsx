import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CommentsModal from "../Home/CommentsModal";
import VotesModal from "../Home/VotesModal";

interface Comment {
  commentId: string;
  userId: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  userName: string;
}

interface PostProps {
  post: Post;
  groupId: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  upvotes: string[];
  downvotes: string[];
  comments: Comment[];
}

interface DecodedToken {
  id: string;
}

const GroupPost: React.FC<PostProps> = ({ post, groupId }) => {
  const [statePost, setStatePost] = useState<Post>(post);
  const [userId, setUserId] = useState<string>("");
  const [isOpenUpvote, setIsOpenUpvote] = useState(false);
  const [isOpenDownvote, setIsOpenDownvote] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  const handleUpvote = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/posts/${statePost._id}/upvote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatePost(response.data.updatedPost);
    } catch (err) {
      console.error("Error upvoting post:", err);
    }
  };

  const handleDownvote = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/posts/${statePost._id}/downvote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatePost(response.data.updatedPost);
    } catch (err) {
      console.error("Error downvoting post:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-600 mb-2">{statePost.title}</h2>
      <p className="text-gray-700 mb-4">{statePost.content}</p>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleUpvote}
          disabled={statePost.upvotes.includes(userId)}
          className={`py-1 px-3 rounded-md ${
            statePost.upvotes.includes(userId)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-blue-500 hover:text-white"
          }`}
        >
          ▲ {statePost.upvotes.length}
        </button>
        <button
          onClick={handleDownvote}
          disabled={statePost.downvotes.includes(userId)}
          className={`py-1 px-3 rounded-md ${
            statePost.downvotes.includes(userId)
              ? "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-red-500 hover:text-white"
          }`}
        >
          ▼ {statePost.downvotes.length}
        </button>
        <button
          onClick={() => setIsOpenComment(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Comment ({statePost.comments.length})
        </button>
      </div>

      {isOpenComment && (
        <CommentsModal
          isOpenState={[isOpenComment, setIsOpenComment]}
          threadId={statePost._id}
        />
      )}
    </div>
  );
};

export default GroupPost;
