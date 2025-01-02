import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

interface Notification {
  _id: string;
  title: string;
  message: string;
  threadId?: string;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFabLoading, setIsFabLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch notifications");
      }

      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    setIsFabLoading(true);
    fetchNotifications().finally(() => setIsFabLoading(false));
  };

  const getNotificationIcon = (title: string) => {
    if (title.toLowerCase().includes("upvoted")) return "⬆️";
    if (title.toLowerCase().includes("downvoted")) return "⬇️";
    if (title.toLowerCase().includes("comment")) return "💬";
    return "🔔";
  };

  const formatTime = (createdAt: string) => {
    try {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const diffMs = now.getTime() - createdDate.getTime();

      const diffMinutes = Math.floor(diffMs / (1000 * 60)) % 60;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "Just now";
      if (diffHours < 1) return `${diffMinutes} min ago`;
      if (diffDays < 1) return `${diffHours} hours ago`;
      if (diffDays < 30) return `${diffDays} days ago`;

      return createdDate.toLocaleDateString();
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
      {loading && notifications.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {!loading && error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && notifications.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500 text-lg">No notifications available.</p>
        </div>
      )}
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification._id}>
            <Link
              to={`/threadDetails/${notification.threadId}`}
              className="block bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl" role="img" aria-label={notification.title}>
                    {getNotificationIcon(notification.title)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-400 mt-2 inline-block">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>
                <div className="flex-shrink-0 self-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg flex justify-center items-center text-3xl hover:bg-blue-600 transition-colors duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={handleRefresh}
        disabled={isFabLoading || loading}
        aria-label="Refresh notifications"
      >
        {isFabLoading || loading ? (
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "↻"
        )}
      </button>
    </div>
  );
};

export default Notifications;

