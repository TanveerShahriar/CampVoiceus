import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import VotesModal from "./VotesModal";

interface AuthorInfo {
  _id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

interface Comment {
  commentId: string;
  userId: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  authorInfo?: AuthorInfo;
  createdAt: string;
}

interface CommentProps {
  comment: Comment;
  threadId: string;
}

interface DecodedToken {
  id: string;
  email: string;
}

async function getAuthorInfo(
  userId: string,
  token: string | null
): Promise<AuthorInfo> {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
    { id: userId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    _id: response.data._id,
    name: response.data.name,
    username: response.data.username,
    avatarUrl: response.data.avatarUrl || "/placeholderCropped.png",
  };
}

const CommentModal: React.FC<CommentProps> = ({ comment, threadId }) => {
  const [stateComment, setStateComment] = useState<Comment>(comment);
  const [isOpenUpvote, setIsOpenUpvote] = useState<boolean>(false);
  const [isOpenDownvote, setIsOpenDownvote] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);

      // Fetch author info for the comment
      getAuthorInfo(stateComment.userId, token).then((authorInfo) => {
        setStateComment((prev) => ({
          ...prev,
          authorInfo,
        }));
      });
    } else {
      console.error("No token found");
    }
  }, [stateComment.userId]);

  const handleOpenUpvoteModal = () => {
    setIsOpenUpvote(true);
  };

  const handleOpenDownvoteModal = () => {
    setIsOpenDownvote(true);
  };

  const handleUpvote = async (commentId: string) => {
    const token = localStorage.getItem("token");
    const upvoteData = {
      threadId,
      commentId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/upvotecomment`,
        upvoteData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { updatedComment } = response.data;
      const authorInfo = await getAuthorInfo(updatedComment.userId, token);

      setStateComment({
        ...updatedComment,
        authorInfo,
      });
    } catch (err: any) {
      console.log("Error upvoting comment:", err);
    }
  };

  const handleDownvote = async (commentId: string) => {
    const token = localStorage.getItem("token");
    const downvoteData = {
      threadId,
      commentId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/downvotecomment`,
        downvoteData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { updatedComment } = response.data;
      const authorInfo = await getAuthorInfo(updatedComment.userId, token);

      setStateComment({
        ...updatedComment,
        authorInfo,
      });
    } catch (err: any) {
      console.log("Error downvoting comment:", err);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 transition p-3 rounded-lg shadow-sm mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <Link
          to={`/profile/${stateComment.authorInfo?.username}`}
          className="flex items-center group mb-2 sm:mb-0"
        >
          <img
            src={stateComment.authorInfo?.avatarUrl || "/placeholderCropped.png"}
            alt={`${stateComment.authorInfo?.name}'s avatar`}
            className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"
          />
          <div>
            <p className="font-semibold text-sm group-hover:text-indigo-600 transition-colors duration-300">
              {stateComment.authorInfo?.name}
            </p>
            <p className="text-gray-500 text-xs group-hover:text-indigo-400 transition-colors duration-300">
              @{stateComment.authorInfo?.username}
            </p>
          </div>
        </Link>
        <span className="text-green-600/70 text-sm font-medium sm:ml-4">
          {formatDate(stateComment.createdAt)}
        </span>
      </div>
      <p className="text-gray-700 mb-2">{stateComment.content}</p>
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center space-x-4">
          <div>
            <button
              onClick={() => handleUpvote(stateComment.commentId)}
              disabled={stateComment.upvotes.includes(userId)}
              className={`py-1 px-3 rounded-xl border ${
                stateComment.upvotes.includes(userId)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              ▲
            </button>
            <button
              onClick={handleOpenUpvoteModal}
              className="py-1 px-3 rounded-xl text-gray-700 hover:text-blue-500"
            >
              {stateComment.upvotes.length}
            </button>
          </div>
          <div>
            <button
              onClick={() => handleDownvote(stateComment.commentId)}
              disabled={stateComment.downvotes.includes(userId)}
              className={`py-1 px-3 rounded-xl border ${
                stateComment.downvotes.includes(userId)
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
              }`}
            >
              ▼
            </button>
            <button
              onClick={handleOpenDownvoteModal}
              className="py-1 px-3 rounded-xl text-gray-700 hover:text-blue-500"
            >
              {stateComment.downvotes.length}
            </button>
          </div>
        </div>

        {isOpenUpvote && (
          <VotesModal
            voteType="Upvotes"
            votes={stateComment.upvotes}
            isOpenState={[isOpenUpvote, setIsOpenUpvote]}
          />
        )}

        {isOpenDownvote && (
          <VotesModal
            voteType="Downvotes"
            votes={stateComment.downvotes}
            isOpenState={[isOpenDownvote, setIsOpenDownvote]}
          />
        )}
      </div>
    </div>
  );
};

export default CommentModal;
