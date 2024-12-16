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
        const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(_id).select('_id');
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }

}