import { useState, useEffect } from "react";
import axios from "axios";
import VotesModal from "./VotesModal";
import CreateThread from "./CreateThread";
import HomeThreads from "./HomeThreads";

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
    const [isOpen, setIsOpen] = useState(false);

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
            <CreateThread></CreateThread>

            <HomeThreads threads={threads} setIsOpen={setIsOpen}></HomeThreads>

            {isOpen && 
                <VotesModal isOpenState={[isOpen, setIsOpen]}></VotesModal>
            }
        </div>
    );
}
