import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentsModal from "../Home/CommentsModal";
import VotesModal from "../Home/VotesModal";

interface Post {
  _id: string;
  title: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  comments: Comment[];
}

interface Comment {
  _id: string;
  userId: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
}

interface PostModalProps {
  post: Post;
  groupId: string;
}

const PostModal: React.FC<PostModalProps> = ({ post, groupId }) => {
  const [statePost, setStatePost] = useState<Post>(post);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isUpvoteModalOpen, setIsUpvoteModalOpen] = useState(false);
  const [isDownvoteModalOpen, setIsDownvoteModalOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: { id: string } = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id);
    }
  }, []);

  const handleUpvote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/posts/${statePost._id}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatePost(response.data.updatedPost);
    } catch (err) {
      console.error("Error upvoting post:", err);
    }
  };

  const handleDownvote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/posts/${statePost._id}/downvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatePost(response.data.updatedPost);
    } catch (err) {
      console.error("Error downvoting post:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-600">{statePost.title}</h2>
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
          onClick={() => setIsCommentModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Comment ({statePost.comments.length})
        </button>
      </div>

      {isCommentModalOpen && (
        <CommentsModal
          isOpenState={[isCommentModalOpen, setIsCommentModalOpen]}
          threadId={statePost._id}
        />
      )}
      {isUpvoteModalOpen && (
        <VotesModal
          voteType="Upvotes"
          votes={statePost.upvotes}
          isOpenState={[isUpvoteModalOpen, setIsUpvoteModalOpen]}
        />
      )}
      {isDownvoteModalOpen && (
        <VotesModal
          voteType="Downvotes"
          votes={statePost.downvotes}
          isOpenState={[isDownvoteModalOpen, setIsDownvoteModalOpen]}
        />
      )}
    </div>
  );
};

export default PostModal;
