import axios from "axios";
import React, { useEffect, useState } from 'react';
import VotesModal from "./VotesModal";
import { jwtDecode } from "jwt-decode";
import CommentsModal from "./CommentsModal";

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

interface Thread {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    comments: Comment[];
    upvotes: string[];
    downvotes: string[];
    file?: File;
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
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/upvote`, upvoteData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
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
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/downvote`, downvoteData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { updatedThread } = response.data;

            setStateThread(updatedThread);
        } catch (err: any) {
            console.log("error");
        }
    };

    const handleFileDownload = async (threadId : string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/threads/filedownload`,
                { threadId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Replace jwtToken with your actual token variable
                    },
                    responseType: 'blob',
                }
            );
            const file = response.data;
            
            const blob = new Blob([file], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            if (stateThread?.file?.name) { 
                link.download = stateThread.file.name;
            } else {
                link.download = "resource";
            }
            link.click();
        } catch (error) {
            console.error(error);
            alert('Failed to download file!');
        }
    }

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

                {stateThread.file ? (
                    <div className="my-4 p-4 border rounded-md bg-gray-50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-700">Attachment: {stateThread.file.name}</p>
                            <button
                                onClick={() => handleFileDownload(stateThread._id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Download File
                            </button>
                        </div>
                    </div>
                ) : (
                    <p></p>
                )}

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
                    <CommentsModal isOpenState={[isOpenComment, setIsOpenComment]} threadId={stateThread._id}></CommentsModal>
                }
            </div>
        </div>
    );
};

export default HomeThread;