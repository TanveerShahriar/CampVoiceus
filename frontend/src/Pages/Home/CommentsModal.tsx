import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Comment {
    userId: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    userName: string;
}

interface ModalProps {
    comments: Comment[];
    isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const CommentsModal: React.FC<ModalProps> = ({ comments, isOpenState }) => {
    const [isOpen, setIsOpen] = isOpenState;
    const [commentsWithNames, setCommentsWithNames] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");

    useEffect(() => {
        const fetchCommentUserNames = async () => {
            try {
                const updatedComments = await Promise.all(
                    comments.map(async (comment) => {
                        const response = await axios.post(
                            `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
                            { id: comment.userId },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
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
    }, [comments]);

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;
        try {
            // Add your logic to save the comment here, e.g., POST to the server
            console.log("New comment submitted:", newComment);
            setNewComment(""); // Clear input field after submission
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={handleCloseModal}
        >
            <div
                className="w-3/4 max-w-[900px] bg-white rounded-lg p-4 shadow-lg relative flex flex-col"
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
                    {commentsWithNames.map((comment, index) => (
                        <div
                            key={`${comment.userId}-${index}`}
                            className="flex flex-col bg-gray-100 hover:bg-gray-200 transition p-3 rounded-lg shadow-sm mb-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">{comment.userName}</span>
                                <div className="flex space-x-2">
                                    <span className="text-green-600 font-bold">Upvotes: {comment.upvotes.length}</span>
                                    <span className="text-red-600 font-bold">Downvotes: {comment.downvotes.length}</span>
                                </div>
                            </div>
                            <p className="text-gray-700 mt-2">{comment.content}</p>
                        </div>
                    ))}
                    {commentsWithNames.length === 0 && (
                        <p className="text-gray-600 text-center">No comments available.</p>
                    )}
                </div>
                <div className="flex items-center border-t pt-2 mt-4">
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