// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { protect, directorOnly, managerOnly, workerOnly } = require('../middlewares/authMiddleware');

// ✅ Public Routes (No Authentication Required)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken); // ✅ Refresh Token (Secure with HTTP-Only Cookie)
router.post('/logout', logout);

// ✅ Protected Routes (Require Authentication)
router.get('/dashboard/director', protect, directorOnly, (req, res) => {
  res.status(200).json({ message: "Welcome, Director!", user: req.user });
});

router.get('/dashboard/manager', protect, managerOnly, (req, res) => {
  res.status(200).json({ message: "Welcome, Manager!", user: req.user });
});

router.get('/dashboard/worker', protect, workerOnly, (req, res) => {
  res.status(200).json({ message: "Welcome, Worker!", user: req.user });
});

// ✅ 404 Error Handler (Keep this last)
router.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = router;
