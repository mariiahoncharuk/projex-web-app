// src/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend URL
  credentials: true // Allow cookies with requests
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB
connectDB()
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });

// ✅ Authentication Routes
app.use('/api/auth', require('./routes/authRoutes'));

// ✅ Dashboard Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ✅ Task Routes
app.use('/api/tasks', require('./routes/taskRoutes'));

// ✅ Project Routes (NEW)
app.use('/api/projects', require('./routes/projectRoutes')); // ✅ Project Routes Registered

// ✅ Simple Test Route
app.get('/api/test', (req, res) => {
  res.send("✅ API is working");
});

// ✅ User Routes (Includes Manager and Worker Fetching)
app.use('/api/users', require('./routes/userRoutes'));

// ✅ Global Error Handling (Catch-All)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Server Setup
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
