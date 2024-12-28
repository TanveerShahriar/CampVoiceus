import { useState, useEffect } from "react";
import axios from "axios";
import CreateThread from "../Home/CreateThread";
import GroupThreads from "./GroupThreads";

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

interface GroupThread {
    _id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    groupId: string;
    comments: Comment[];
    upvotes: string[];
    downvotes: string[];
    file?: File;
}

export default function GroupPage() {
    const [threads, setThreads] = useState<GroupThread[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .post(
                `${import.meta.env.VITE_SERVER_URL}/groups/groupthreads`,
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
            
            <GroupThreads threads={threads}></GroupThreads>
        </div>
    );
}
