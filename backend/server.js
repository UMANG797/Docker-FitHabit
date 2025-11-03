require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const habitsRoutes = require('./routes/habit.js');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load Mongo URL from .env
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error('❌ MONGO_URL is not defined! Make sure you have a .env file in the backend root with MONGO_URL set.');
    process.exit(1); // Stop the app if env variable is missing
}

mongoose.connect(mongoUrl)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

app.use('/api/habits', habitsRoutes);

const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=>
{
    res.json({message:"Welcome to FitHabit API"});
})
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
