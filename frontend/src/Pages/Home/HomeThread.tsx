import axios from "axios";
import React, { useEffect, useState } from 'react';

interface Thread {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    upvotes: string[];
    downvotes: string[];
};

interface HomeThreadProps {
    thread: Thread;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeThread: React.FC<HomeThreadProps> = ({ thread, setIsOpen }) => {
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);

    useEffect(() => {
        setUpvotes(thread.upvotes.length);
        setDownvotes(thread.downvotes.length);
    }, []);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleUpvote = async (threadId : string) => {
        const token = localStorage.getItem('token');
        const upvoteData = {
            upvoter : token, // Set the authorId from JWT
            threadId
        };
        
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/upvote`, upvoteData);
            setUpvotes((prevUpvotes) => prevUpvotes + 1);
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
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/downvote`, downvoteData);
            setDownvotes((pervDownvotes) => pervDownvotes + 1);
        } catch (err: any) {
            console.log("error");
        }
    };
    return (
        <div>
            <div className="p-6 bg-gray-100 rounded-md shadow-md">
                <h2 className="text-xl font-bold text-indigo-600">
                    {thread.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    By: {thread.authorName || "Unknown"}
                </p>
                <p className="text-gray-700 mb-4">{thread.content}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <button
                                onClick={() => handleUpvote(thread._id)}
                                className={`py-1 px-3 rounded-md border ${
                                    false
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                                }`}
                        >
                            ▲
                            </button>
                            <button
                                onClick={handleOpenModal}
                                className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500"
                            >
                                {upvotes}
                            </button>
                        </div>

                        <div>
                            <button
                            onClick={() => handleDownvote(thread._id)}
                                className={`py-1 px-3 rounded-md border ${
                                    false
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                                }`}
                            >
                            ▼
                            </button>
                            <button
                                onClick={handleOpenModal}
                                className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500"
                            >
                                {downvotes}
                            </button>
                        </div>
                    </div>

                    <button
                        className="py-1 px-4 rounded-md border bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                    >
                        Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeThread;