import React from 'react';
import { Link } from 'react-router-dom';

const CreateThread: React.FC = () => {
  return (
    <div>
        <p className="text-gray-700 text-center mb-6">
            Discover threads or create your own!
        </p>

        <Link
            to="/createthread"
            className="block w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center mb-8"
        >
            Create Your Own Thread
        </Link>
    </div>
  );
};

export default CreateThread;
