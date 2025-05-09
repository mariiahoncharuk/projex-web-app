const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, directorOnly, managerOnly } = require('../middlewares/authMiddleware');

// ✅ Route to Fetch All Managers (Directors Only)
router.get('/managers', protect, directorOnly, async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('name email _id');
    res.status(200).json(managers);
  } catch (error) {
    console.error("❌ Error fetching managers:", error);
    res.status(500).json({ error: 'Failed to fetch managers' });
  }
});

// ✅ Route to Fetch All Workers (Directors and Managers Only)
router.get('/workers', protect, managerOnly, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('name email _id');
    res.status(200).json(workers);
  } catch (error) {
    console.error("❌ Error fetching workers:", error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

module.exports = router;
