import bcrypt from 'bcrypt';
import User from '../models/user.model.mjs';

export async function welcome(req, res) {
    res.send("Hello World!");
}

export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
  
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({ name, email, password : hashedPassword });
        await newUser.save();
    
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
        } catch (error) {
            console.error('Error in registerUser:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
  }