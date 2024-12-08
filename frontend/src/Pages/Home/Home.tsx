import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

type Thread = {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    upvotes: string[];
    downvotes: string[];
};

export default function Home() {
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        // Fetch threads from the backend
        axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/homethreads`)
            .then((response) => {
                setThreads(response.data);
            })
            .catch((error) => {
                console.error("Error fetching threads:", error);
            });
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <p className="text-gray-700 text-center mb-6">
                Discover threads or create your own!
            </p>

            <Link
                to="/createthread"
                className="block w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center mb-8"
            >
                Create Your Own Thread
            </Link>

            <div className="space-y-6">
                {threads.length > 0 ? (
                    threads.map((thread) => (
                        <div
                            key={thread._id}
                            className="p-6 bg-gray-100 rounded-md shadow-md"
                        >
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
                                            className={`py-1 px-3 rounded-md border ${
                                                false
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                                            }`}
                                        >
                                            ▲
                                        </button>
                                        <button
                                            className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500"
                                        >
                                            {thread.upvotes.length}
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            className={`py-1 px-3 rounded-md border ${
                                                false
                                                    ? "bg-red-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                                            }`}
                                        >
                                            ▼
                                        </button>
                                        <button
                                            className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500"
                                        >
                                            {thread.downvotes.length}
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
                    ))
                ) : (
                    <p className="text-gray-500 text-center">
                        No threads available. Be the first to create one!
                    </p>
                )}
            </div>
        </div>
    );
}
