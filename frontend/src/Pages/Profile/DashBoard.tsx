import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl text-gray-600">👤</span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500">@{user?.username}</p>
          </div>
        </div>
        <div className="mt-4">
          <p>
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          {user?.bio && (
            <p className="mt-2">
              <span className="font-semibold">Bio:</span> {user.bio}
            </p>
          )}
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
