// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Authentication Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Simple Test Route
app.get('/api/test', (req, res) => {
  res.send("API is working");
});

// Server Setup
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
