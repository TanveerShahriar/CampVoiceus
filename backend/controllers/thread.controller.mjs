import jwt from 'jsonwebtoken';
import { Thread } from '../models/index.mjs'

export async function createThread(req, res) {
    try {
        const { title, content, author } = req.body;

        const decoded = jwt.verify(author, process.env.JWT_SECRET_KEY);
        const authorId = decoded.id;
    
        const newThread = new Thread({ title, content, authorId });
        await newThread.save();
    
        res.status(201).json({
            message: 'Thread registered successfully',
        });
        } catch (error) {
            console.error('Error in registerUser:', error);
            res.status(500).json({ error: 'Internal server error' });
    }
}