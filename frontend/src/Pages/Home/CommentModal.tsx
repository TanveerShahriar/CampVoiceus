import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CommentsVotingModal from './CommentsVotingModal';
import { jwtDecode } from 'jwt-decode';

interface Comment {
    commentId: string;
    userId: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    userName: string;
}

interface CommentProps {
    comment: Comment;
    threadId: string;
}

interface DecodedToken {
    id: string;
    email: string;
}

async function getName(userId: string, token: string|null): Promise<string> {
    const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
        { id: userId },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    ) 
    return response.data.name;  
}

const CommentModal: React.FC<CommentProps> = ({ comment, threadId }) => {
    const [stateComment, setStateComment] = useState<Comment>(comment);
    const [isOpenUpvote, setIsOpenUpvote] = useState<boolean>(false);
    const [isOpenDownvote, setIsOpenDownvote] = useState<boolean>(false);
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

    const handleUpvote = async (commentId : string) => {
            const token = localStorage.getItem('token');
            const upvoteData = {
                threadId,
                commentId
            };
            
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/upvotecomment`, upvoteData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const { updatedComment } = response.data;
                updatedComment.userName = await getName(updatedComment.userId, token);

                setStateComment(updatedComment);  
            } catch (err: any) {
                console.log("error");
            }
        };
    
        const handleDownvote = async (commentId : string) => {
            const token = localStorage.getItem('token');
            const downvoteData = {
                threadId,
                commentId
            };
            
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/downvotecomment`, downvoteData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const { updatedComment } = response.data;
                updatedComment.userName = await getName(updatedComment.userId, token);
    
                setStateComment(updatedComment);  
            } catch (err: any) {
                console.log("error");
            }
        };

    return(
        <div
            className="flex flex-col bg-gray-100 transition p-3 rounded-lg shadow-sm mb-2"
        >
            <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">{stateComment.userName}</span>
            </div>
            <p className="text-gray-700 mt-2">{stateComment.content}</p>
            <div className="flex items-center justify-between p-1">
                <div className="flex items-center space-x-4">
                    <div>
                        <button
                            onClick={() => handleUpvote(stateComment.commentId)}
                            disabled={stateComment.upvotes.includes(userId)}
                            className={`py-1 px-3 rounded-md border ${
                                stateComment.upvotes.includes(userId)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                            ▲
                        </button>
                        <button onClick={handleOpenUpvoteModal} className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500">
                            {stateComment.upvotes.length}
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => handleDownvote(stateComment.commentId)}
                            disabled={stateComment.downvotes.includes(userId)}
                            className={`py-1 px-3 rounded-md border ${
                                stateComment.downvotes.includes(userId)
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                            }`}
                        >
                            ▼
                        </button>
                        <button onClick={handleOpenDownvoteModal} className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500">
                            {stateComment.downvotes.length}
                        </button>
                    </div>
                </div>
                {isOpenUpvote && 
                    <CommentsVotingModal voteType="Upvotes" votes={comment.upvotes} isOpenState={[isOpenUpvote, setIsOpenUpvote]}></CommentsVotingModal>
                }

                {isOpenDownvote && 
                    <CommentsVotingModal voteType="Downvotes" votes={comment.downvotes} isOpenState={[isOpenDownvote, setIsOpenDownvote]}></CommentsVotingModal>
                }
            </div>
        </div>  
    );
};

export default CommentModal;