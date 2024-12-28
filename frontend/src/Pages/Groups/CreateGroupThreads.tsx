import React from "react";
import { Link, useParams } from "react-router-dom";

const CreateThread: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>(); // Extract groupId from the URL

  return (
    <div>
      <p className="text-gray-700 text-center mb-6">
        {groupId
          ? "Explore group threads or create your own!"
          : "Discover threads or create your own!"}
      </p>

      <Link
        to={groupId ? `/groups/${groupId}/createthread` : "/createthread"} // Navigate based on groupId presence
        className="block w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center mb-8"
      >
        {groupId ? "Create Group Thread" : "Create Your Own Thread"}
      </Link>
    </div>
  );
};

export default CreateThread;
