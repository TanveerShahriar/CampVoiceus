import React from 'react';
import HomeThread from './HomeThread';

interface Thread {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    upvotes: string[];
    downvotes: string[];
};

interface HomeThreadsProps {
    threads: Thread[];
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeThreads: React.FC<HomeThreadsProps> = ({ threads, setIsOpen }) => {
    return (
        <div>
            <div className="space-y-6">
                {threads.length > 0 ? (
                    threads.map((thread) => (
                        <HomeThread key={thread._id} thread={thread} setIsOpen={setIsOpen}></HomeThread>
                ))
            ) : (
                    <p className="text-gray-500 text-center">
                        No threads available. Be the first to create one!
                    </p>
                )}
            </div>
        </div>
    );
};

export default HomeThreads;
