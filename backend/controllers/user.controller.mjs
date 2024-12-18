import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.mjs';
import validator from 'validator';

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
        const { name, username, email, password } = req.body;
  
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({ name, username, email, password : hashedPassword });
        await newUser.save();
    
        res.status(201).json({
            message: 'User registered successfully',
        });
        } catch (error) {
            console.error('Error in registerUser:', error);
            res.status(500).json({ error: 'Internal server error' });
    }
}

export async function loginUser(req, res){
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }    
  
    try {
        const isEmail = validator.isEmail(identifier);
        const user = isEmail
            ? await User.findOne({ email: identifier })
            : await User.findOne({ username: identifier });

        if (!user) {
            throw new Error("Invalid email or username");
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

export async function getUserById(req, res){
    try {
        const { id } = req.body;
    
        if (!id) {
          return res.status(400).json({ error: 'User ID is required' });
        }
    
        const user = await User.findById(id);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.status(200).json({ name: user.name });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}