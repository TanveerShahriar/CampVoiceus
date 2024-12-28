import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

export const requireAuth = async function(req, res, next) {
    // Verify authentication token
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        // Decode the JWT and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use your JWT secret key

        // Fetch the user by ID and attach to the request object
        const user = await User.findById(decoded.id).select("_id");
        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        req.user = { id: user._id };   //Attach only the user ID to the request object

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in requireAuth middleware:', error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};
