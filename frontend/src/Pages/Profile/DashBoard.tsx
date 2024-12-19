import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Grid, Bookmark } from 'lucide-react';
import UserThreads from '../../components/UserThreads.tsx';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<User>(
          `${import.meta.env.VITE_SERVER_URL}/users/token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!user) return <p className="text-center mt-8">No user data available</p>;

  console.log(user._id);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={user.avatarUrl || '/placeholder.png?height=150&width=150'}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-between mb-4">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
                onClick={() => navigate("/profile/edit")}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
            <p className="text-gray-600 mb-2">@{user.username}</p>
            <p className="text-gray-800 mb-4">{user.bio || 'No bio available'}</p>
            <div className="flex justify-center md:justify-start space-x-6 text-sm">
              <span><strong>123</strong> posts</span>
              <span><strong>1.5k</strong> followers</span>
              <span><strong>500</strong> following</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-center space-x-8 border-b">
          <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-500">
            <Grid className="w-5 h-5 inline-block mr-1" /> Threads
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
            <Bookmark className="w-5 h-5 inline-block mr-1" /> Saved
          </button>
        </div>
      </div>
      <UserThreads userId={user._id} />
    </div>
  );
};

export default Dashboard;

