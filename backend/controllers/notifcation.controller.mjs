import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Notification } from '../models/index.mjs';

export async function getNotifications(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    try {
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 }) // Latest first
            .limit(10); // Limit to the latest 10 notifications
        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
