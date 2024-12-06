import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email }, // Payload
        process.env.JWT_SECRET_KEY,          // Secret key for signing
    );
};

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

export async function loginUser(req, res){
    const { email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
    
        res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};