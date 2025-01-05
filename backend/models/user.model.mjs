import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation
            },
            message: 'Invalid email format.',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    
    avatarUrl: {
        type: String,
        required: false,
    },

    bio: {
        type: String,
        required: false,
    },

    expertise: {
        type: [
          {
            name: { type: String, required: true },
            credentialUrl: { type: String, required: true },
          },
        ],
        validate: {
          validator: function (expertise) {
            return expertise.length <= 3;
          },
          message: "You can only have up to 3 areas of expertise.",
        },
        required: false,
      },

    interests: {
        type: [String], 
        default: [], 
        validate: {
            validator: function (interests) {
              return interests.length <= 5;
            },
            message: "You can only have up to 5 interests.",
        },
        required: false
    },

    fcmToken: { 
        type: String,
        required: false,
     },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
