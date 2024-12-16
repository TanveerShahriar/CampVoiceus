import axios from "axios";
import React, { useEffect, useState } from 'react';
import VotesModal from "./VotesModal";
import { jwtDecode } from "jwt-decode";
import CommentsModal from "./CommentsModal";

interface Comment {
    userId: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    userName: string;
}

interface Thread {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    comments: Comment[];
    upvotes: string[];
    downvotes: string[];
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

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded: DecodedToken = jwtDecode(token);
            setUserId(decoded.id);
        } else {
            console.error("No token found");
        }
    }, []);

    const handleOpenUpvoteModal = () => {
        setIsOpenUpvote(true);
    };

    const handleOpenDownvoteModal = () => {
        setIsOpenDownvote(true);
    };

    const handleOpenCommentModal = () => {
        setIsOpenComment(true);
    };

    const handleUpvote = async (threadId : string) => {
        const token = localStorage.getItem('token');
        const upvoteData = {
            upvoter : token, // Set the authorId from JWT
            threadId
        };
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/upvote`, upvoteData);
            const { updatedThread } = response.data;

            setStateThread(updatedThread);
        } catch (err: any) {
            console.log("error");
        }
    };

    const handleDownvote = async (threadId : string) => {
        const token = localStorage.getItem('token');
        const downvoteData = {
            downvoter : token, // Set the authorId from JWT
            threadId
        };
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/downvote`, downvoteData);
            const { updatedThread } = response.data;

            setStateThread(updatedThread);
        } catch (err: any) {
            console.log("error");
        }
    };
    return (
        <div>
            <div className="p-6 bg-gray-100 rounded-md shadow-md">
                <h2 className="text-xl font-bold text-indigo-600">
                    {stateThread.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    By: {stateThread.authorName || "Unknown"}
                </p>
                <p className="text-gray-700 mb-4">{stateThread.content}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
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
                        className="py-1 px-4 rounded-md border bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                    >
                        Comment
                    </button>
                </div>

                {isOpenUpvote && 
                    <VotesModal voteType="Upvotes" votes={stateThread.upvotes} isOpenState={[isOpenUpvote, setIsOpenUpvote]}></VotesModal>
                }

                {isOpenDownvote && 
                    <VotesModal voteType="Downvotes" votes={stateThread.downvotes} isOpenState={[isOpenDownvote, setIsOpenDownvote]}></VotesModal>
                }

                {isOpenComment && 
                    <CommentsModal comments={stateThread.comments} isOpenState={[isOpenComment, setIsOpenComment]}></CommentsModal>
                }
            </div>
        </div>
    );
};

export default HomeThread;