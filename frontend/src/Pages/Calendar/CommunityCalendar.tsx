import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    attendees: string[];
}

const CommunityCalendar: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. User might not be logged in.");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
                alert("Failed to fetch events. Please log in again.");
            }
        }

        fetchEvents();
    }, []);

    const handleRSVP = async (eventId: string) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/events/rsvp`,
                { eventId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("RSVP successful!");
        } catch (error) {
            console.error("Error during RSVP:", error);
            alert("Failed to RSVP. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Community Calendar</h1>
            {events.map((event) => (
                <div key={event._id} className="mb-4 p-4 bg-white shadow-md rounded-md">
                    <h2 className="text-lg font-semibold">{event.title}</h2>
                    <p>{event.description}</p>
                    <p>
                        <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                    </p>
                    <p>
                        <strong>Attendees:</strong> {event.attendees.length}
                    </p>
                    <button
                        onClick={() => handleRSVP(event._id)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        RSVP
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CommunityCalendar;
