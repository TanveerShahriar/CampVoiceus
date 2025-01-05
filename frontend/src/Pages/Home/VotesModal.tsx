import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Voter {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

interface ModalProps {
  voteType: String;
  votes: string[];
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const VotesModal: React.FC<ModalProps> = ({ voteType, votes, isOpenState }) => {
  const [isOpen, setIsOpen] = isOpenState;
  const [voters, setVoters] = useState<Voter[]>([]);

  useEffect(() => {
    const fetchVoterNames = async () => {
      try {
        const token = localStorage.getItem("token");
        const voterData = await Promise.all(
          votes.map(async (id) => {
            const response = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/users/getuserbyid`,
              { id },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return {
              id,
              name: response.data.name,
              username: response.data.username,
              avatarUrl: response.data.avatarUrl,
            };
          })
        );
        setVoters(voterData);
      } catch (error) {
        console.error("Error fetching voter names:", error);
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
        className="w-3/4 max-w-[900px] bg-white rounded-lg p-4 shadow-lg relative flex flex-col max-h-[90vh]"
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
            <Link
              to={`/profile/${voter.username}`}
              className="flex items-center group p-1 mb-1 sm:mb-1 border border-separate bg-slate-200 rounded-lg transition-all duration-300 hover:border-indigo-500"
            >
              <img
                src={
                  voter.avatarUrl ||
                  "/placeholderCropped.png"
                }
                alt={`${voter.name}'s avatar`}
                className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"
              />
              <div>
                <p className="font-semibold text-sm group-hover:text-indigo-600 transition-colors duration-300">
                  {voter.name}
                </p>
                <p className="text-gray-500 text-xs group-hover:text-indigo-400 transition-colors duration-300">
                  @{voter.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotesModal;
