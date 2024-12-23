import React from "react";

interface GroupCardProps {
  groupName: string;
  description: string;
  memberCount: number;
  onJoin?: () => void; // Optional join action
  onViewDetails?: () => void; // Optional view details action
  isJoined?: boolean; // Whether the user has already joined
}

const GroupCard: React.FC<GroupCardProps> = ({
  groupName,
  description,
  memberCount,
  onJoin,
  onViewDetails,
  isJoined = false,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition">
      <h3 className="text-lg font-bold mb-2">{groupName}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500 mb-4">Members: {memberCount}</p>
      <div className="flex justify-between">
        {onJoin && (
          <button
            onClick={onJoin}
            disabled={isJoined}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isJoined
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isJoined ? "Joined" : "Join"}
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
