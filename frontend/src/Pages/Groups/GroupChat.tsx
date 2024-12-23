import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const GroupChat: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>(); // Extract groupId from the route
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data.messages);
        setGroupName(response.data.groupName);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [groupId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/groups/${groupId}/messages`,
        { content: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", content: newMessage, timestamp: new Date().toISOString() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{groupName} - Group Chat</h1>
      <div className="bg-gray-100 rounded-md p-4 mb-4 h-96 overflow-y-scroll">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <p className="font-semibold">{message.sender}</p>
            <p>{message.content}</p>
            <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
