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

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
