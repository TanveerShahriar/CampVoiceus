import { Thread } from '../models/index.mjs';

async function getThreadWithMaxUpvotes() {
    try {
      const [thread] = await Thread.aggregate([
        {
          $addFields: {
            upvoteCount: { $size: '$upvotes' }, // Add a temporary field for the array length
          },
        },
        { $sort: { upvoteCount: -1 } }, // Sort by the array length in descending order
        { $limit: 1 }, // Limit to the thread with the most upvotes
      ]);
  
      return thread;
    } catch (error) {
      console.error('Error fetching thread with max upvotes:', error);
      throw error;
    }
  }

export default getThreadWithMaxUpvotes;