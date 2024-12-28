import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.mjs';
import { sendNotification } from '../config/fcm.mjs';
import { Thread } from '../models/index.mjs';
import { User } from '../models/index.mjs';
import { Notification } from '../models/index.mjs';

export async function createThread(req, res) {
    try {
        const { title, content, tags } = req.body; // Include tags in the request body
        const file = req.file;

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const authorId = decoded.id;

        console.log(tags);

        const threadData = {
            title,
            content,
            authorId,
            tags: typeof tags === "string" ? tags.split(",").map(tag => tag.trim()) : tags,
        };
    
        // Upload file to Cloudinary if present
        if (file) {
            const uploadResponse = await new Promise((resolve, reject) => {
                const options = {
                    folder: 'campV_threads',
                    resource_type: file.mimetype === 'application/zip' ? 'raw' : 'auto', // Handle ZIP files as raw
                };
        
                const stream = cloudinary.uploader.upload_stream(
                    options,
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
        
                stream.end(file.buffer);
            });
        
            threadData.file = {
                name: file.originalname,
                url: uploadResponse.secure_url,
                publicId: uploadResponse.public_id,
                contentType: file.mimetype,
            };
        }
        

        const newThread = new Thread(threadData);
        await newThread.save();
    
        res.status(201).json({
            message: 'Thread created successfully',
            thread: newThread,
        });
    } catch (error) {
        console.error('Error in createThread:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getThreadsByTag(req, res) {
    try {
        const { tag } = req.params;

        const threads = await Thread.find({ tags: tag }).sort({ createdAt: -1 });

        res.status(200).json({
            message: `Threads with tag: ${tag}`,
            threads,
        });
    } catch (error) {
        console.error('Error in getThreadsByTag:', error);
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
  
      res.redirect(file.url);
    } catch (error) {
      console.error('Error in fileDownload:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  }
  

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

            const notificationTitle = "Your thread was upvoted!";
            const notificationMessage = `${upvoterName} just upvoted your thread titled "${thread.title}".`;

            await sendNotification(
                author.fcmToken,
                notificationTitle,
                notificationMessage,
                threadId
            );

            // Save notification in MongoDB
            await Notification.create({
                userId: author._id,
                title: notificationTitle,
                message: notificationMessage,
                threadId: thread._id,
            });

            // Trim notifications to keep only the last 10
            const notificationsCount = await Notification.countDocuments({ userId: author._id });
            if (notificationsCount > 10) {
                const oldestNotification = await Notification.find({ userId: author._id })
                    .sort({ createdAt: 1 })
                    .limit(notificationsCount - 10);
                const idsToDelete = oldestNotification.map((n) => n._id);
                await Notification.deleteMany({ _id: { $in: idsToDelete } });
            }
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
        return res.status(400).json({ error: 'User name is required for downvoting' });
    }

    try {
        const thread = await Thread.findById(threadId);

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        if (thread.downvotes.includes(downvoterId)) {
            return res.status(400).json({ error: 'User has already downvoted this thread' });
        }

        thread.upvotes = thread.upvotes.filter((id) => id !== downvoterId);
        thread.downvotes.push(downvoterId);

        await thread.save();

        // Get current user info
        const user = await User.findById(downvoterId);
        const downvoterName = user.name;

        // Fetch thread author's FCM token
        const author = await User.findById(thread.authorId);
        if (author?.fcmToken) {
            const notificationTitle = "Your thread was downvoted!";
            const notificationMessage = `${downvoterName} just downvoted your thread titled "${thread.title}".`;

            await sendNotification(
                author.fcmToken,
                notificationTitle,
                notificationMessage,
                threadId
            );

            // Save notification in MongoDB
            await Notification.create({
                userId: author._id,
                title: notificationTitle,
                message: notificationMessage,
                threadId: thread._id,
            });

            // Trim notifications to keep only the last 10
            const notificationsCount = await Notification.countDocuments({ userId: author._id });
            if (notificationsCount > 10) {
                const oldestNotification = await Notification.find({ userId: author._id })
                    .sort({ createdAt: 1 })
                    .limit(notificationsCount - 10);
                const idsToDelete = oldestNotification.map((n) => n._id);
                await Notification.deleteMany({ _id: { $in: idsToDelete } });
            }
        }

        return res.status(200).json({ message: 'Downvoted successfully', updatedThread: thread });
    } catch (error) {
        console.error('Error handling downvote:', error);
        return res.status(500).json({ error: 'An error occurred while downvoting' });
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        if (!userId) {
            return res.status(401).json({ error: 'Invalid token or user not authorized.' });
        }

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found.' });
        }

        const newComment = {
            userId,
            content,
            upvotes: [],
            downvotes: [],
            createdAt: new Date(),
        };

        thread.comments.push(newComment);
        await thread.save();

        // Get current user info
        const user = await User.findById(userId);
        const commenterName = user.name;

        // Fetch thread author's FCM token
        const author = await User.findById(thread.authorId);
        if (author?.fcmToken) {
            const notificationTitle = "New comment on your thread!";
            const notificationMessage = `${commenterName} just commented on your thread titled "${thread.title}".`;

            await sendNotification(
                author.fcmToken,
                notificationTitle,
                notificationMessage,
                threadId
            );

            // Save notification in MongoDB
            await Notification.create({
                userId: author._id,
                title: notificationTitle,
                message: notificationMessage,
                threadId: thread._id,
            });

            // Trim notifications to keep only the last 10
            const notificationsCount = await Notification.countDocuments({ userId: author._id });
            if (notificationsCount > 10) {
                const oldestNotification = await Notification.find({ userId: author._id })
                    .sort({ createdAt: 1 })
                    .limit(notificationsCount - 10);
                const idsToDelete = oldestNotification.map((n) => n._id);
                await Notification.deleteMany({ _id: { $in: idsToDelete } });
            }
        }

        return res.status(200).json({ message: 'Comment added successfully.', thread });
    } catch (error) {
        console.error('Error adding comment:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        return res.status(500).json({ error: 'Internal server error.' });
    }
}



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
        return res.status(400).json({ error: 'User ID is required for upvoting.' });
    }

    if (!threadId || !commentId) {
        return res.status(400).json({ message: 'Thread ID and comment ID are required.' });
    }

    try {
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found.' });
        }

        const comment = thread.comments.find((c) => c.commentId.equals(new mongoose.Types.ObjectId(commentId)));
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comment.upvotes.includes(userId)) {
            return res.status(400).json({ message: 'You have already upvoted this comment.' });
        }

        comment.downvotes = comment.downvotes.filter((id) => id !== userId);
        comment.upvotes.push(userId);

        await thread.save();

        const user = await User.findById(userId);
        const upvoterName = user.name;

        const author = await User.findById(comment.userId);
        if (author?.fcmToken) {
            const notificationTitle = "Your comment was upvoted!";
            const notificationMessage = `${upvoterName} just upvoted your comment on the thread titled "${thread.title}".`;

            await sendNotification(
                author.fcmToken,
                notificationTitle,
                notificationMessage,
                threadId
            );

            // Save notification in MongoDB
            await Notification.create({
                userId: author._id,
                title: notificationTitle,
                message: notificationMessage,
                threadId: thread._id,
            });

            // Trim notifications to keep only the last 10
            const notificationsCount = await Notification.countDocuments({ userId: author._id });
            if (notificationsCount > 10) {
                const oldestNotification = await Notification.find({ userId: author._id })
                    .sort({ createdAt: 1 })
                    .limit(notificationsCount - 10);
                const idsToDelete = oldestNotification.map((n) => n._id);
                await Notification.deleteMany({ _id: { $in: idsToDelete } });
            }
        }

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
        return res.status(400).json({ error: 'User ID is required for downvoting.' });
    }

    if (!threadId || !commentId) {
        return res.status(400).json({ message: 'Thread ID and comment ID are required.' });
    }

    try {
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found.' });
        }

        const comment = thread.comments.find((c) => c.commentId.equals(new mongoose.Types.ObjectId(commentId)));
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comment.downvotes.includes(userId)) {
            return res.status(400).json({ message: 'You have already downvoted this comment.' });
        }

        comment.upvotes = comment.upvotes.filter((id) => id !== userId);
        comment.downvotes.push(userId);

        await thread.save();

        const user = await User.findById(userId);
        const downvoterName = user.name;

        const author = await User.findById(comment.authorId);
        if (author?.fcmToken) {
            const notificationTitle = "Your comment was downvoted!";
            const notificationMessage = `${downvoterName} just downvoted your comment on the thread titled "${thread.title}".`;

            await sendNotification(
                author.fcmToken,
                notificationTitle,
                notificationMessage,
                threadId
            );

            // Save notification in MongoDB
            await Notification.create({
                userId: author._id,
                title: notificationTitle,
                message: notificationMessage,
                threadId: thread._id,
            });

            // Trim notifications to keep only the last 10
            const notificationsCount = await Notification.countDocuments({ userId: author._id });
            if (notificationsCount > 10) {
                const oldestNotification = await Notification.find({ userId: author._id })
                    .sort({ createdAt: 1 })
                    .limit(notificationsCount - 10);
                const idsToDelete = oldestNotification.map((n) => n._id);
                await Notification.deleteMany({ _id: { $in: idsToDelete } });
            }
        }

        return res.status(200).json({ message: 'Comment downvoted successfully.', updatedComment: comment });
    } catch (error) {
        console.error('Error downvoting comment:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
