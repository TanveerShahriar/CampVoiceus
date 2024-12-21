import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

export const requireAuth = async function(req, res, next) {
    
    // verify authentication token

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use your JWT secret key
        req.user = await User.findById(decoded.id).select("_id"); 
        if (!req.user) {
            return res.status(401).json({ error: "User not found." });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }

}