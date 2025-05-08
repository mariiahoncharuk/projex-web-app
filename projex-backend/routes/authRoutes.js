// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, directorOnly, managerOnly, workerOnly } = require('../middlewares/authMiddleware');

// Registration Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Protected Dashboard Routes
router.get('/dashboard/director', protect, directorOnly, (req, res) => {
  res.status(200).json({ message: "Welcome, Director!" });
});

router.get('/dashboard/manager', protect, managerOnly, (req, res) => {
  res.status(200).json({ message: "Welcome, Manager!" });
});

router.get('/dashboard/worker', protect, workerOnly, (req, res) => {
  res.status(200).json({ message: "Welcome, Worker!" });
});

module.exports = router;
