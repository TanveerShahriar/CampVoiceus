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

export async function homeThreads(req, res) {
    try {
        const threads = await Thread.find().sort({ createdAt: -1 });;
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch threads" });
    }
}

export async function getThreadById(req, res){
    try {
        const { id } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'Thread ID is required' });
        }
    
        const thread = await Thread.findById(id);
    
        if (!thread) {
          return res.status(404).json({ error: 'Thread not found' });
        }
    
        res.status(200).json({ thread });
    } catch (error) {
        console.error('Error fetching thread:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function upvote(req, res) {
    const { upvoter, threadId } = req.body;
    
    const decoded = jwt.verify(upvoter, process.env.JWT_SECRET_KEY);
    const upvoterId = decoded.id;

    if (!upvoterId) {
        return res.status(400).json({ error: 'User name is required for upvoting' });
    }

    try {
        const thread = await Thread.findById(threadId);

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        if (thread.upvotes.includes(upvoterId)) {
            return res.status(400).json({ error: 'User has already upvoted this thread' });
        }

        thread.downvotes = thread.downvotes.filter((id) => id !== upvoterId);

        thread.upvotes.push(upvoterId);

        await thread.save();

        return res.status(200).json({ message: 'Upvoted successfully', updatedThread : thread });
    } catch (error) {
        console.error('Error handling upvote:', error);
        return res.status(500).json({ error: 'An error occurred while upvoting' });
    }
}

export async function downvote(req, res) {
    const { downvoter, threadId } = req.body;
    
    const decoded = jwt.verify(downvoter, process.env.JWT_SECRET_KEY);
    const downvoterId = decoded.id;

    if (!downvoterId) {
        return res.status(400).json({ error: 'User name is required for upvoting' });
    }

    try {
        const thread = await Thread.findById(threadId);

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        if (thread.downvotes.includes(downvoterId)) {
            return res.status(400).json({ error: 'User has already upvoted this thread' });
        }

        thread.upvotes = thread.upvotes.filter((id) => id !== downvoterId);

        thread.downvotes.push(downvoterId);

        await thread.save();

        return res.status(200).json({ message: 'Upvoted successfully', updatedThread : thread });
    } catch (error) {
        console.error('Error handling upvote:', error);
        return res.status(500).json({ error: 'An error occurred while upvoting' });
    }
}

export async function comment(req, res) {
    const { threadId, content, token } = req.body;

    if (!threadId || !content || !token) {
        return res.status(400).json({ error: 'Thread ID, content, and token are required.' });
    }

    try {
        // Decode the token to extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        if (!userId) {
            return res.status(401).json({ error: 'Invalid token or user not authorized.' });
        }

        // Find the thread by ID
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found.' });
        }

        // Create a new comment
        const newComment = {
            userId,
            content,
            upvotes: [],
            downvotes: [],
            createdAt: new Date(),
        };

        // Add the comment to the thread
        thread.comments.push(newComment);

        // Save the thread
        await thread.save();

        // Send back the updated thread
        return res.status(200).json({ message: 'Comment added successfully.', thread });
    } catch (error) {
        console.error('Error adding comment:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
