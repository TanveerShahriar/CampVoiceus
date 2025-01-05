import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';

interface EditProfileData {
  name: string;
  bio: string;
  avatarUrl: File | null;
  interests: string[];
  expertise: Array<{ name: string; credentialUrl: string }>;
}

const ProfileEdit: React.FC = () => {
  const [formData, setFormData] = useState<EditProfileData>({
    name: '',
    bio: '',
    avatarUrl: null,
    interests: [],
    expertise: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [interestInput, setInterestInput] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, bio, avatarUrl, interests, expertise } = response.data;
        setFormData({ name, bio: bio || '', avatarUrl: null, interests: interests || [], expertise: expertise || [] });
        setPreviewUrl(avatarUrl);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, avatarUrl: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && formData.interests.length < 5) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, interestInput.trim()] }));
      setInterestInput('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('bio', formData.bio);
    if (formData.avatarUrl) formPayload.append('avatarUrl', formData.avatarUrl);
    formPayload.append('interests', JSON.stringify(formData.interests));
    formPayload.append('expertise', JSON.stringify(formData.expertise));

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/profile/edit`, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <div className="relative group">
            <img
              src={previewUrl || "/placeholder.svg?height=150&width=150"}
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 transition-all duration-200 group-hover:opacity-75"
            />
            <label
              htmlFor="avatarUrl"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <Camera className="w-6 h-6" />
            </label>
            <input
              type="file"
              id="avatarUrl"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Interests (Up to 5)</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="interests"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add an interest..."
            />
            <button
              type="button"
              onClick={addInterest}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              disabled={formData.interests.length >= 5}
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <Link to="/expertise/edit" className="text-green-800 hover:bg-green-500 hover:text-green-900 bg-green-400 p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium text-center mb-1">Expertise</p>
            <p className="text-sm text-center">Add your credentials to showcase your expertise</p>
          </Link>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
