import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VotesModal from "./VotesModal";
import { jwtDecode } from "jwt-decode";
import CommentsModal from "./CommentsModal";
import { formatDate } from "../../utils/dateFormatter";

interface File {
  name: string;
  contentType: string;
  data: ArrayBuffer;
}

interface Comment {
  commentId: string;
  userId: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  userName: string;
}

interface AuthorInfo {
  _id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  tags?: string[];
  authorId: string;
  authorInfo?: AuthorInfo;
  comments: Comment[];
  upvotes: string[];
  downvotes: string[];
  file?: File;
  createdAt: string;
  type?: string;
}

interface HomeThreadProps {
  thread: Thread;
}

interface DecodedToken {
  id: string;
  email: string;
}

const HomeThread: React.FC<HomeThreadProps> = ({ thread }) => {
  const [stateThread, setStateThread] = useState<Thread>(thread);
  const [isOpenUpvote, setIsOpenUpvote] = useState<boolean>(false);
  const [isOpenDownvote, setIsOpenDownvote] = useState<boolean>(false);
  const [isOpenComment, setIsOpenComment] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isQna, setIsQna] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);
    } else {
      console.error("No token found");
    }

    setIsQna(stateThread.type === "qna");
    console.log(stateThread.type);

    const fetchAuthorInfo = async () => {
      if (!stateThread.authorInfo) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
            { id: stateThread.authorId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStateThread((prevThread) => ({
            ...prevThread,
            authorInfo: {
              _id: response.data._id,
              name: response.data.name,
              username: response.data.username,
              avatarUrl: response.data.avatarUrl,
            },
          }));
        } catch (error) {
          console.error("Error fetching author info:", error);
        }
      }
    };

    fetchAuthorInfo();
  }, [stateThread.authorId]);

  const handleOpenUpvoteModal = () => {
    setIsOpenUpvote(true);
  };

  const handleOpenDownvoteModal = () => {
    setIsOpenDownvote(true);
  };

  const handleOpenCommentModal = () => {
    setIsOpenComment(true);
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

  const handleFileDownload = async (threadId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/filedownload`,
        { threadId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const file = response.data;

      const blob = new Blob([file], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      if (stateThread?.file?.name) {
        link.download = stateThread.file.name;
      } else {
        link.download = "resource";
      }
      link.click();
    } catch (error) {
      console.error(error);
      alert("Failed to download file!");
    }
  };

  const renderContentWithLineBreaks = (content: string) => {
    return { __html: content.replace(/\n/g, "<br/>") };
  };

  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center mb-2">
        {tags.map((tag, index) => (
          <Link
            to={`/tag/${tag}`}
            key={index}
            className="bg-indigo-100 text-purple-700 text-sm px-1 py-1 rounded-md mr-2 hover:bg-indigo-200"
          >
            #{tag}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <Link
          to={`/profile/${stateThread.authorInfo?.username}`}
          className="flex items-center group mb-2 sm:mb-0"
        >
          <img
            src={stateThread.authorInfo?.avatarUrl || "/placeholderCropped.png"}
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
        <span className="text-green-600/70 text-sm font-medium sm:ml-4">
          {formatDate(stateThread.createdAt)}
        </span>
      </div>

      {/* Title and Content */}
      {isQna ? (
        <h2 className="text-xl font-bold text-red-600 mb-2">
        <Link
          to={`/threadDetails/${stateThread._id}`}
          className="hover:underline"
        >
          {stateThread.title}
        </Link>
      </h2>
      ) : (
        <h2 className="text-xl font-bold text-indigo-600 mb-2">
        <Link
          to={`/threadDetails/${stateThread._id}`}
          className="hover:underline"
        >
          {stateThread.title}
        </Link>
      </h2>
      )}
      <p
        className="text-gray-700 mb-4"
        dangerouslySetInnerHTML={renderContentWithLineBreaks(
          stateThread.content
        )}
      ></p>

      {/* File Attachment */}
      {stateThread.file && (
        <div className="my-4 p-4 border rounded-md bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-700">
              Attachment: {stateThread.file.name}
            </p>
            <button
              onClick={() => handleFileDownload(stateThread._id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Download File
            </button>
          </div>
        </div>
      )}

      {/* Tags */}
      {renderTags(stateThread.tags)}

      {/* Voting Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 mt-2">
          <div>
            <button
              onClick={() => handleUpvote(stateThread._id)}
              disabled={stateThread.upvotes.includes(userId)}
              className={`py-1 px-3 rounded-md border ${
                stateThread.upvotes.includes(userId)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              ▲
            </button>
            <button
              onClick={handleOpenUpvoteModal}
              className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500"
            >
              {stateThread.upvotes.length}
            </button>
          </div>

          <div>
            <button
              onClick={() => handleDownvote(stateThread._id)}
              disabled={stateThread.downvotes.includes(userId)}
              className={`py-1 px-3 rounded-md border ${
                stateThread.downvotes.includes(userId)
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
              }`}
            >
              ▼
            </button>
            <button
              onClick={handleOpenDownvoteModal}
              className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500"
            >
              {stateThread.downvotes.length}
            </button>
          </div>
        </div>

        <button
          onClick={handleOpenCommentModal}
          className="flex items-center space-x-4 py-1 px-4 rounded-md border 
      bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
        >
          {isQna ? "Answers" : "Comments"}
           <p className="py-1 px-3">{stateThread.comments.length}</p>
        </button>
      </div>

      {/* Modals */}
      {isOpenUpvote && (
        <VotesModal
          voteType="Upvotes"
          votes={stateThread.upvotes}
          isOpenState={[isOpenUpvote, setIsOpenUpvote]}
        />
      )}
      {isOpenDownvote && (
        <VotesModal
          voteType="Downvotes"
          votes={stateThread.downvotes}
          isOpenState={[isOpenDownvote, setIsOpenDownvote]}
        />
      )}
      {isOpenComment && (
        <CommentsModal
          isOpenState={[isOpenComment, setIsOpenComment]}
          threadId={stateThread._id}
          isQna={isQna}
        />
      )}
    </div>
  );
};

export default HomeThread;
