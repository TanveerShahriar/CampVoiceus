import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { sendNotification } from '../config/fcm.mjs';
import { Thread } from '../models/index.mjs'
import { User } from '../models/index.mjs'

export async function createThread(req, res) {
    try {
        const { title, content } = req.body;
        const file = req.file;

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const authorId = decoded.id;

        const threadData = { title, content, authorId, };
    
        if (file) {
            threadData.file = {
              name: file.originalname,
              contentType: file.mimetype,
              data: file.buffer,
            };
        }

        const newThread = new Thread(threadData);
        await newThread.save();
    
        res.status(201).json({
            message: 'Thread registered successfully',
        });
        } catch (error) {
            console.error('Error in createThread:', error);
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

export async function fileDownload(req, res) {
    try {
        const { threadId } = req.body;
        
        const thread = await Thread.findById(threadId);
        const file = thread.file;
        if (!file) return res.status(404).json({ error: 'File not found' });
        res.set({
            'Content-Type': file.contentType,
            'Content-Disposition': `attachment; filename="${file.name}"`,
        });
        res.send(file.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to download file' });
    }
};

export async function upvote(req, res) {
    const { threadId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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

        // get current user info
        const user = await User.findById(upvoterId);
        const upvoterName = user.name;

        // Fetch thread author's FCM token
        const author = await User.findById(thread.authorId);
        if (author?.fcmToken) {
            await sendNotification(
                author.fcmToken,
                "Your thread was upvoted!",
                `${upvoterName} just upvoted your thread titled "${thread.title}".`,
                threadId
            );
        }

        return res.status(200).json({ message: 'Upvoted successfully', updatedThread : thread });
    } catch (error) {
        console.error('Error handling upvote:', error);
        return res.status(500).json({ error: 'An error occurred while upvoting' });
    }
}

export async function downvote(req, res) {
    const { threadId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
    const { threadId, content } = req.body;

    if (!threadId || !content) {
        return res.status(400).json({ error: 'Thread ID and content are required.' });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
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


export async function getUserThreads(req, res) {
    const { userId } = req.params;

    try {
        const threads = await Thread.find({ authorId: userId }).sort({ createdAt: -1 });
        res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching user threads:', error);
        res.status(500).json({ error: 'An error occurred while fetching user threads' });
    }
}

export async function upvoteComment(req, res) {
    const { threadId, commentId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    if (!userId) {
        return res.status(400).json({ error: 'User name is required for upvoting' });
    }

    if (!threadId || !commentId) {
        return res.status(400).json({ message: 'threadId, and commentId are required.' });
    }

    try {
        // Find the thread containing the comment
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found.' });
        }

        // Locate the comment in the thread
        const comment = thread.comments.find((c) => c.commentId.equals(new mongoose.Types.ObjectId(commentId)));
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Check if user has already upvoted the comment
        if (comment.upvotes.includes(userId)) {
            return res.status(400).json({ message: 'You have already upvoted this comment.' });
        }

        // Remove userId from downvotes if present
        comment.downvotes = comment.downvotes.filter((id) => id !== userId);

        // Add userId to upvotes
        comment.upvotes.push(userId);

        // Save the updated thread document
        await thread.save();

        return res.status(200).json({ message: 'Comment upvoted successfully.', updatedComment: comment });
    } catch (error) {
        console.error('Error upvoting comment:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export async function downvoteComment(req, res) {
    const { threadId, commentId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    if (!userId) {
        return res.status(400).json({ error: 'User name is required for upvoting' });
    }

    if (!threadId || !commentId) {
        return res.status(400).json({ message: 'threadId, and commentId are required.' });
    }

    try {
        // Find the thread containing the comment
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found.' });
        }

        // Locate the comment in the thread
        const comment = thread.comments.find((c) => c.commentId.equals(new mongoose.Types.ObjectId(commentId)));
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Check if user has already downvoted the comment
        if (comment.downvotes.includes(userId)) {
            return res.status(400).json({ message: 'You have already downvoted this comment.' });
        }

        // Remove userId from upvotes if present
        comment.upvotes = comment.upvotes.filter((id) => id !== userId);

        // Add userId to upvotes
        comment.downvotes.push(userId);

        // Save the updated thread document
        await thread.save();

        return res.status(200).json({ message: 'Comment upvoted successfully.', updatedComment: comment });
    } catch (error) {
        console.error('Error upvoting comment:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};