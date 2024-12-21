import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    hallName: string;
    houseNo: string;
    roadNo: string;
    areaName: string;
    thana: string;
    district: string;
  };
}

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your events.");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/events/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events.");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter(
        (event) => new Date(event.date).toDateString() === selectedDate.toDateString()
      );
      setFilteredEvents(filtered);
    }
  }, [selectedDate, events]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Events</h1>
      <Calendar onChange={(date) => setSelectedDate(date as Date)} />
      {selectedDate && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            Events on {selectedDate.toDateString()}
          </h2>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id} className="mb-4 p-4 bg-white shadow-md rounded-md">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {[event.location.hallName, event.location.houseNo, event.location.roadNo, event.location.areaName, event.location.thana, event.location.district]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            ))
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
