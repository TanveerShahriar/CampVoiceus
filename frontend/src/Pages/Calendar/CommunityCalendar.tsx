import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
    _id: string;
    title: string;
    description: string;
    location: {
        hallName: String,
        houseNo: String,
        roadNo: String,
        areaName: String,
        thana: String,
        district: String,
    };
    date: string; // ISO string from the backend
    attendees: string[];
}

const CommunityCalendar: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. User might not be logged in.");
                return;
            }

            try {
                const decodedToken: any = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
                setUserId(decodedToken.id); // Store user ID from token

                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
                alert("Failed to fetch events. Please log in again.");
            }
        };

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
            alert("Thank you for going to this event!");
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === eventId ? { ...event, attendees: [...event.attendees, userId] } : event
                )
            );
        } catch (error) {
            console.error("Error during RSVP:", error);
            alert("Error RSVP-ing to the event.");
        }
    };

    const handleCancelRSVP = async (eventId: string) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/events/cancel-rsvp`,
                { eventId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Your RSVP has been canceled.");
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === eventId
                        ? { ...event, attendees: event.attendees.filter((attendee) => attendee !== userId) }
                        : event
                )
            );
        } catch (error) {
            console.error("Error during RSVP cancelation:", error);
            alert("Error canceling your RSVP.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Community Calendar</h1>
            {events.map((event) => {
                const isAttending = event.attendees.includes(userId);

                // Convert the date and time from ISO format to a readable format
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                const formattedTime = eventDate.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                return (
                    <div key={event._id} className="mb-4 p-4 bg-white shadow-md rounded-md">
                        <h2 className="text-lg font-semibold">{event.title}</h2>
                        <p>{event.description}</p>
                        <p>
                            <strong>Location:</strong>{" "}
                            {[
                                "Hall: " +
                                event.location.hallName,
                                " House No. " +
                                event.location.houseNo,
                                " Road No. " +
                                event.location.roadNo,
                                " Area: " +
                                event.location.areaName,
                                " Thana: " +
                                event.location.thana,
                                " District: " +
                                event.location.district,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                        </p>


                        <p>
                            <strong>Date:</strong> {formattedDate}
                        </p>
                        <p>
                            <strong>Time:</strong> {formattedTime}
                        </p>
                        <p>
                            <strong>Attendees:</strong> {event.attendees.length}
                        </p>
                        <div className="flex space-x-4 mt-2">
                            <button
                                onClick={() => handleRSVP(event._id)}
                                disabled={isAttending}
                                className={`px-4 py-2 rounded-md ${isAttending
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                GOING
                            </button>
                            {isAttending && (
                                <button
                                    onClick={() => handleCancelRSVP(event._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CommunityCalendar;
