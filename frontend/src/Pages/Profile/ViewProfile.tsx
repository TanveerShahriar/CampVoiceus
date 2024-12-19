import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface ProfileData {
  name: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}

const ViewProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);

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

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <img
          src={profile.avatarUrl || '/default-avatar.png'}
          alt={`${profile.name}'s avatar`}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-gray-600">@{profile.username}</p>
        <p className="mt-2 text-gray-800">{profile.bio || 'No bio available'}</p>
      </div>
    </div>
  );
};

export default ViewProfile;