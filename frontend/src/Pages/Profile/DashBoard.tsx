import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit2, Grid, Bookmark, Award, Book, User } from 'lucide-react';
import UserThreads from '../../components/UserThreads';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  interests?: string[];
  expertise?: Array<{ name: string; credentialUrl: string }>;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'threads' | 'saved'>('threads');
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
          { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!user) return <div className="flex items-center justify-center h-screen">No user data available</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 sm:h-48"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-24 mb-4 sm:mb-0">
                <img
                  src={user.avatarUrl || '/placeholderCropped.png'}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-xl text-gray-600">@{user.username}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center"
                  onClick={() => navigate("/profile/edit")}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Bio
                </h2>
                <p className="text-gray-600">{user.bio || 'No bio available'}</p>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <Book className="w-5 h-5 mr-2 text-blue-500" />
                  Interests
                </h2>
                {user.interests && user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No interests added yet</p>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <Award className="w-5 h-5 mr-2 text-blue-500" />
                  Expertise
                </h2>
                {user.expertise && user.expertise.length > 0 ? (
                  <div className="space-y-2">
                    {user.expertise.map((exp, index) => (
                       <span key={index} className="bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 mr-2 rounded-full">
                        <a
                          key={index}
                          href={exp.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          >
                          {exp.name}
                        </a>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No expertise added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-center space-x-8 border-b border-gray-200">
            <button
              className={`px-4 py-2 ${activeTab === 'threads' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('threads')}
            >
              <Grid className="w-5 h-5 inline-block mr-1" /> Threads
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'saved' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark className="w-5 h-5 inline-block mr-1" /> Saved
            </button>
          </div>
        </div>
        <div className="mt-6">
          {activeTab === 'threads' && <UserThreads userId={user._id} />}
          {activeTab === 'saved' && <div className="text-center text-gray-500">Saved threads feature coming soon!</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
