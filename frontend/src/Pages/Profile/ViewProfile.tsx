import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserThreads from '../../components/UserThreads';
import { Grid, Award, Book, User } from 'lucide-react';

interface ProfileData {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
  expertise?: Array<{ name: string; credentialUrl: string }>;
}

const ViewProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'threads' | 'saved'>('threads');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get<ProfileData>(
          `${import.meta.env.VITE_SERVER_URL}/users/profile/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!profile) return <div className="flex items-center justify-center h-screen">Profile not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 sm:h-48"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-24 mb-4 sm:mb-0">
                <img
                  src={profile.avatarUrl || '/placeholder.svg?height=150&width=150'}
                  alt={`${profile.name}'s avatar`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-xl text-gray-600">@{profile.username}</p>
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
                <p className="text-gray-600">{profile.bio || 'No bio available'}</p>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <Book className="w-5 h-5 mr-2 text-blue-500" />
                  Interests
                </h2>
                {profile.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
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
                {profile.expertise && profile.expertise.length > 0 ? (
                  <div className="space-y-2">
                    {profile.expertise.map((exp, index) => (
                      <a
                        key={index}
                        href={exp.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded hover:bg-indigo-200 transition-colors duration-200"
                      >
                        {exp.name}
                      </a>
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
          </div>
        </div>
        <div className="mt-6">
          {activeTab === 'threads' && profile._id && <UserThreads userId={profile._id} />}
        </div>
      </div>
    </div>
  );
};export default ViewProfile;

