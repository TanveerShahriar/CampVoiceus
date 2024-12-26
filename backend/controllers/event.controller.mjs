import Event from "../models/event.model.mjs";

export const createEvent = async (req, res) => {
  const { title, description, location, date } = req.body;
  const userId = req.user._id;

  try {
    // Validate required fields
    if (!title || !description || !location || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newEvent = new Event({
      title,
      description,
      location,
      date, // The frontend sends this as an ISO string
      createdBy: userId,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name username");
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const rsvpEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ error: "User is already attending this event." });
    }

    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ message: "RSVP successful.", event });
  } catch (error) {
    console.error("Error during RSVP:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

  export const cancelRSVP = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user._id;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
  
      if (!event.attendees.includes(userId)) {
        return res.status(400).json({ error: "User is not attending this event." });
      }
  
      event.attendees = event.attendees.filter((attendee) => attendee.toString() !== userId.toString());
      await event.save();
  
      res.status(200).json({ message: "RSVP canceled successfully.", event });
    } catch (error) {
      console.error("Error canceling RSVP:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  

  export const getMyEvents = async (req, res) => {
    
    const userId = req.user.id;
  
    try {
      const myEvents = await Event.find({ attendees: userId }).populate(
        "createdBy",
        "name username"
      );
      res.status(200).json(myEvents);
    } catch (error) {
      console.error("Error fetching my events:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };