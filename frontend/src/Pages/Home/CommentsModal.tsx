import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CommentsVotingModal from './CommentsVotingModal';

interface Comment {
    commentId: string;
    userId: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    userName: string;
}

interface ModalProps {
    isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    threadId: string;
}

const CommentsModal: React.FC<ModalProps> = ({ isOpenState, threadId }) => {
    const [isOpen, setIsOpen] = isOpenState;
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsWithNames, setCommentsWithNames] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");

    const [isOpenUpvote, setIsOpenUpvote] = useState<boolean>(false);
    const [isOpenDownvote, setIsOpenDownvote] = useState<boolean>(false);

    const handleOpenUpvoteModal = () => {
        setIsOpenUpvote(true);
    };

    const handleOpenDownvoteModal = () => {
        setIsOpenDownvote(true);
    };

    useEffect(() => {
        const fetchCommentUserNames = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/getthreadbyid`, { id : threadId }, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                  });
                
                  setComments(res.data.thread.comments);
                
                const updatedComments = await Promise.all(
                    comments.map(async (comment) => {
                        const response = await axios.post(
                            `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
                            { id: comment.userId },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        return { ...comment, userName: response.data.name || 'Unknown' };
                    })
                );
                setCommentsWithNames(updatedComments);
            } catch (error) {
                console.error('Error fetching comment user names:', error);
            }
        };

        fetchCommentUserNames();
    }, [comments, commentsWithNames]);

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("User is not logged in.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/comment`, {
                threadId,
                content: newComment,
                token
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

            if (response.data && response.data.thread) {
                const newComment = response.data.thread.comments.slice(-1)[0]; // Get the last added comment
                const userResponse = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
                    { id: newComment.userId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const updatedComment = { ...newComment, userName: userResponse.data.name || 'Unknown' };
                setCommentsWithNames((prev) => [...prev, updatedComment]); // Append new comment
                setNewComment(""); // Clear input field after submission
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleUpvote = async (commentId : string) => {
        const token = localStorage.getItem('token');
        const upvoteData = {
            upvoter : token, // Set the authorId from JWT
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

            setComments(updatedComment);
        } catch (err: any) {
            console.log("error");
        }
    };

    const handleDownvote = async (commentId : string) => {
        const token = localStorage.getItem('token');
        const downvoteData = {
            downvoter : token, // Set the authorId from JWT
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

            setComments(updatedComment);
        } catch (err: any) {
            console.log("error");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={handleCloseModal}
        >
            <div
                className="w-3/4 max-w-[900px] bg-white rounded-lg p-4 shadow-lg relative flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <div className="flex-1 overflow-y-auto mb-4">
                    {commentsWithNames.map((comment) => (
                        <div
                            key={comment.commentId}
                            className="flex flex-col bg-gray-100 transition p-3 rounded-lg shadow-sm mb-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">{comment.userName}</span>
                            </div>
                            <p className="text-gray-700 mt-2">{comment.content}</p>
                            <div className="flex items-center justify-between p-1">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <button
                                            onClick={() => handleUpvote(comment.commentId)}
                                            className={`py-1 px-3 rounded-md border ${
                                                false
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                                            }`}
                                        >
                                            ▲
                                        </button>
                                        <button onClick={handleOpenUpvoteModal} className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500">
                                            {comment.upvotes.length}
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleDownvote(comment.commentId)}
                                            className={`py-1 px-3 rounded-md border ${
                                                false
                                                    ? "bg-red-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                                            }`}
                                        >
                                            ▼
                                        </button>
                                        <button onClick={handleOpenDownvoteModal} className="py-1 px-3 rounded-md text-gray-700 hover:text-blue-500">
                                            {comment.downvotes.length}
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
                    ))}
                    {commentsWithNames.length === 0 && (
                        <p className="text-gray-600 text-center">No comments available.</p>
                    )}
                </div>
                <div className="flex items-center border-t pt-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 border rounded-md px-3 py-2 mr-2"
                    />
                    <button
                        onClick={handleAddComment}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;