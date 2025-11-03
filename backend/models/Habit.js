const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    createdAt: { type: Date, default: Date.now },
    history: { type: [Date], default: [] },       // ✅ use Date type
    lastCompleted: { type: Date, default: null }, // ✅ use Date type
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    badges: { type: [String], default: [] }       // ✅ default empty array
});

// ✅ Export the model
module.exports = mongoose.model('Habit', HabitSchema);
