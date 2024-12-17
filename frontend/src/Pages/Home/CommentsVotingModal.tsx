import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Voter {
    id: string;
    name: string;
}

interface ModalProps {
    voteType: String;
    votes: string[];
    isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const CommentsVotingModal: React.FC<ModalProps> = ({ voteType, votes, isOpenState }) => {
    const [isOpen, setIsOpen] = isOpenState;
    const [voters, setVoters] = useState<Voter[]>([]);

    useEffect(() => {
        const fetchVoterNames = async () => {
        try {
            const token = localStorage.getItem("token");
            const voterData = await Promise.all(
            votes.map(async (id) => {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`, {id}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                });
                return { id, name: response.data.name };
            })
            );
            setVoters(voterData);
        } catch (error) {
            console.error('Error fetching voter names:', error);
        }
        };

        fetchVoterNames();
    }, [votes]);

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
        onClick={handleCloseModal}
        >
            <div
                className="w-1/2 max-w-[50vw] bg-white rounded-lg p-4 shadow-lg relative flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200 text-3xl font-bold"
                aria-label="Close"
                >
                &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">{voteType}</h2>
                <div className="flex-1 overflow-y-auto">
                    {voters.map((voter) => (
                        <div
                        key={voter.id}
                        className="flex items-center bg-gray-100 hover:bg-gray-200 transition p-3 rounded-lg shadow-sm mb-2"
                        >
                        <span className="text-gray-800 font-medium">{voter.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentsVotingModal;