import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: {
    hallName: String,
    houseNo: String,
    roadNo: String,
    areaName: String,
    thana: String,
    district: String,
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  date: { type: Date, required: true }
});


  const Event = mongoose.model("Event", EventSchema);
  
  export default Event;
  