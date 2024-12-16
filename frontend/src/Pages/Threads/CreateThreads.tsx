import { useState } from "react";
import axios from "axios";

export default function CreateThreads() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const threadData = {
        ...formData,
        author: token, // Set the authorId from JWT
      };

      // Post data to the backend
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/threads/createthread`, threadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setFormData({ title: "", content: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to create the thread. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Create a Thread</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">Thread created successfully!</p>}

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
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            value={formData.content}
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
          {loading ? "Submitting..." : "Submit Thread"}
        </button>
      </form>
    </div>
  );
}