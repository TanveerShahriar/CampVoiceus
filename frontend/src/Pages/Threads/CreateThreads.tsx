import { useState } from "react";
import axios from "axios";

export default function CreateThreads() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files, type } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      setFile(files[0]);
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const clearFile = () => {
    setFile(null);
    (document.getElementById("file") as HTMLInputElement).value = ""; // Reset input field
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const threadData = new FormData();
      threadData.append("title", formData.title);
      threadData.append("content", formData.content);
      if (file) threadData.append("file", file);
      if (tags.length > 0) threadData.append("tags", tags.join(","));

      // Post data to the backend
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/threads/createthread`,
        threadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setFormData({ title: "", content: "", file: null });
      setTags([]);
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

        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-md px-3 py-2 mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeTag(tag)}
                >
                  &#x2715; {/* Cross icon */}
                </button>
              </span>
            ))}
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyPress}
              className="flex-grow border-none focus:outline-none"
              placeholder="Add a tag and press comma..."
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            File Upload
          </label>
          <p className="text-xs"> (Only images, videos or zip allowed! Max Size: 10MB) </p>
          <div className="relative mt-1 flex items-center">
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold 
                file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {file && (
              <button
                type="button"
                onClick={clearFile}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 focus:outline-none"
                aria-label="Clear file"
              >
                &#x2715; {/* Cross Icon */}
              </button>
            )}
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected File: <span className="font-medium">{file.name}</span>
            </p>
          )}
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
