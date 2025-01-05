import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.mjs';
import validator from 'validator';
import multer from "multer";
import cloudinary from '../config/cloudinary.mjs';
import dotevn from 'dotenv';

dotevn.config();

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

export async function getUserById(req, res) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(id).select('-password'); // Exclude password field

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



export const getUserByToken = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.id).select('-password'); 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
};


export const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-password'); // Exclude password for security
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
};




// Multer setup
const upload = multer({ storage: multer.memoryStorage() }); // Temporary memory storage

export const updateUserByUsername = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { name, bio, interests } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    let avatarUrl = null;

    // Process the image upload
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "campV_profile_dps" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        stream.end(req.file.buffer);
      });

      avatarUrl = await uploadPromise;
    }

    let validatedInterests = [];
    if (interests) {
      validatedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;

      if (!Array.isArray(validatedInterests) || validatedInterests.length > 5) {
        return res
          .status(400)
          .json({ error: "You can only have up to 5 interests." });
      }
    }

    const updateFields = { name, bio };
    if (avatarUrl) updateFields.avatarUrl = avatarUrl;
    if (validatedInterests.length > 0) updateFields.interests = validatedInterests;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      interests: user.interests,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating user data" });
  }
};



export async function saveFcmToken(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    const { fcmToken } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    if (!fcmToken) {
        return res.status(400).json({ error: "FCM token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Update the user's FCM token
        const user = await User.findByIdAndUpdate(
            decoded.id,
            { fcmToken },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "FCM token saved successfully",
            userId: user._id,
        });
    } catch (error) {
        console.error("Error saving FCM token:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}


export const updateExpertiseByUsername = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { name } = req.body;
  const file = req.file;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    if (!name) {
      return res.status(400).json({ error: "Expertise name is required." });
    }

    let credentialUrl = null;
    if (file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'campV_expertise_creds' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
      credentialUrl = await uploadPromise;
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const existingExpertiseIndex = user.expertise.findIndex(
      (exp) => exp.name === name
    );

    if (existingExpertiseIndex >= 0) {
      if (credentialUrl) {
        const oldCredentialUrl = user.expertise[existingExpertiseIndex].credentialUrl;
        if (oldCredentialUrl) {
          const publicId = oldCredentialUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`campV_expertise_creds/${publicId}`);
        }
        user.expertise[existingExpertiseIndex].credentialUrl = credentialUrl;
      }
    } else {
      if (!credentialUrl) {
        return res
          .status(400)
          .json({ error: "Credential is required for a new expertise." });
      }
      user.expertise.push({ name, credentialUrl });
    }

    await user.save();

    res.status(200).json({
      message: "Expertise updated successfully.",
      expertise: user.expertise,
    });
  } catch (error) {
    console.error("Error updating expertise:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating expertise." });
  }
};


export const deleteExpertiseByUsername = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Expertise name is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const expertiseIndex = user.expertise.findIndex(
      (exp) => exp.name.toLowerCase() === name.toLowerCase()
    );

    if (expertiseIndex === -1) {
      return res.status(404).json({ error: "Expertise not found." });
    }

    const credentialUrl = user.expertise[expertiseIndex].credentialUrl;
    if (credentialUrl) {
      const publicId = credentialUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`campV_expertise_creds/${publicId}`);
    }

    user.expertise.splice(expertiseIndex, 1);
    await user.save();

    res.status(200).json({
      message: "Expertise deleted successfully.",
      expertise: user.expertise,
    });
  } catch (error) {
    console.error("Error deleting expertise:", error);
    res.status(500).json({ error: "An error occurred while deleting expertise." });
  }
};
