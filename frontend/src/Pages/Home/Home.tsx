import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
    const [threads, setThreads] = useState([
        { id: 1, title: "How to learn React?", author: "John Doe" },
        { id: 2, title: "Best practices for Node.js", author: "Jane Smith" },
        { id: 3, title: "CSS tips for beginners", author: "Emily Johnson" },
    ]);

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
                            key={thread.id}
                            className="p-6 bg-gray-100 rounded-md shadow-md"
                        >
                            <h2 className="text-xl font-bold text-indigo-600">
                                {thread.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                By: {thread.author}
                            </p>
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
