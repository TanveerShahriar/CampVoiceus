import React from 'react';
import HomeThread from './HomeThread';

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
    authorId: string;
    authorInfo?: AuthorInfo;
    comments: Comment[];
    upvotes: string[];
    downvotes: string[];
}

interface HomeThreadsProps {
    threads: Thread[];
}

const HomeThreads: React.FC<HomeThreadsProps> = ({ threads }) => {
    return (
        <div>
            <div className="space-y-6">
                {threads.length > 0 ? (
                    threads.map((thread) => (
                        <HomeThread key={thread._id} thread={thread} />
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

