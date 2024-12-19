import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const { name, bio, username } = response.data;
        localStorage.setItem("username", username);
        setFormData((prevData) => ({
          ...prevData,
          name,
          bio: bio || "",
        }));
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Avatar</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;

