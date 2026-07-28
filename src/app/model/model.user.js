// models/User.js
import mongoose from 'mongoose';

// Message schema defined first
const messageSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now // Har naye message par current time save hoga
    },
    message: {
        type: String,
        required: true // Message empty nahi hona chahiye
    }
});

// User schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true // Spaces remove karne ke liye
    },
    gmail: {
        type: String,
        required: true,
        unique: true, // Ek email se ek hi account banna chahiye
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    // Agar ek user multiple messages rakhega toh array use karein []
    // Agar sirf ek message rakhna hai toh array brackets hata dein
    messages: [messageSchema]

}, { timestamps: true }); // createdAt aur updatedAt automatically add ho jayenge

export default mongoose.models.User || mongoose.model('User', UserSchema);