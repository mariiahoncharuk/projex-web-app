// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect, directorOnly, managerOnly } = require('../middlewares/authMiddleware');

// Director Dashboard Route
// GET /api/dashboard/director
router.get('/director', protect, directorOnly, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Director Dashboard', user: req.user });
});

// Manager Dashboard Route
// GET /api/dashboard/manager
router.get('/manager', protect, managerOnly, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Manager Dashboard', user: req.user });
});

module.exports = router;
