import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera } from 'lucide-react';

interface EditProfileData {
  name: string;
  bio?: string;
  avatarUrl?: File | null;
}

const ProfileEdit: React.FC = () => {
  const [formData, setFormData] = useState<EditProfileData>({
    name: "",
    bio: "",
    avatarUrl: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, bio, username, avatarUrl } = response.data;
        localStorage.setItem("username", username);
        setFormData((prevData) => ({
          ...prevData,
          name,
          bio: bio || "",
        }));
        setPreviewUrl(avatarUrl);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, avatarUrl: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!username) {
      setError("Username is not available for the update.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    if (formData.bio) formPayload.append("bio", formData.bio);
    if (formData.avatarUrl) formPayload.append("avatarUrl", formData.avatarUrl);

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/profile/edit`, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={previewUrl || '/placeholder.png?height=150&width=150'}
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            />
            <label htmlFor="avatarUrl" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="avatarUrl"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;

