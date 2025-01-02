import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserThreads from '../../components/UserThreads';
import { Grid } from 'lucide-react';

interface ProfileData {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}

const ViewProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'threads' | 'saved'>('threads');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={profile.avatarUrl || '/placeholder.png?height=150&width=150'}
            alt={`${profile.name}'s avatar`}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-between mb-4">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="hidden md:flex space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Follow
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">@{profile.username}</p>
            <p className="text-gray-800 mb-4">{profile.bio || 'No bio available'}</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-center space-x-8 border-b">
          <button 
            className={`px-4 py-2 ${activeTab === 'threads' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('threads')}
          >
            <Grid className="w-5 h-5 inline-block mr-1" /> Threads
          </button>
        </div>
      </div>
      {activeTab === 'threads' && <UserThreads userId={profile._id} />}
      {activeTab === 'saved' && <div className="text-center text-gray-500">Saved threads feature coming soon!</div>}
    </div>
  );
};

export default ViewProfile;

