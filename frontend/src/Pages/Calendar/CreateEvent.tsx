import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: {
      hallName: "",
      houseNo: "",
      roadNo: "",
      areaName: "",
      thana: "",
      district: "",
    },
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Check if the input is part of the location object
    if (name in formData.location) {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const { title, description, location, date, time } = formData;
      if (!title || !description || !date || !time || Object.values(location).some((field) => field === "")) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      const formattedDateTime = new Date(`${date}T${time}`).toISOString(); // Combine date and time

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/events/create`,
        {
          title,
          description,
          location,
          date: formattedDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event created successfully!");
      navigate("/calendar"); // Redirect to the Explore Events page
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Create Event</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>

        {/* Location Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="hallName"
              placeholder="Hall Name"
              value={formData.location.hallName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <input
              type="text"
              name="houseNo"
              placeholder="House No"
              value={formData.location.houseNo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <input
              type="text"
              name="roadNo"
              placeholder="Road No"
              value={formData.location.roadNo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <input
              type="text"
              name="areaName"
              placeholder="Area Name"
              value={formData.location.areaName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <input
              type="text"
              name="thana"
              placeholder="Thana"
              value={formData.location.thana}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.location.district}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
