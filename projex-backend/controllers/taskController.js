// src/controllers/taskController.js
const Task = require('../models/Task');

// Get tasks assigned to the logged-in worker
const getWorkerTasks = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure this gets the logged-in user's ID

    // Fetch tasks assigned to the worker
    const tasks = await Task.find({ assignedTo: userId }).populate('assignedTo', 'name avatar');

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching worker tasks:", error);
    res.status(500).json({ message: "Error fetching worker tasks" });
  }
};

// Export all functions
module.exports = { getWorkerTasks };
