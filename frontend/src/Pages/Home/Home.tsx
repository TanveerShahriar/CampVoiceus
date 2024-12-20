import { useState, useEffect } from "react";
import axios from "axios";
import CreateThread from "./CreateThread";
import HomeThreads from "./HomeThreads";

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
    authorId: string;
    authorName: string;
    comments: Comment[];
    upvotes: string[];
    downvotes: string[];
    file?: File;
}

export default function Home() {
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .post(
                `${import.meta.env.VITE_SERVER_URL}/threads/homethreads`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setThreads(response.data);
            })
            .catch((error) => {
                console.error("Error fetching threads:", error);
            });
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <CreateThread></CreateThread>
            
            <HomeThreads threads={threads}></HomeThreads>
        </div>
    );
}
