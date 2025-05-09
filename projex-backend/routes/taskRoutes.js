// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect, managerOnly, directorOnly, workerOnly } = require('../middlewares/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User');

// ✅ Route to fetch all workers (Managers and Directors only)
router.get('/workers', protect, managerOnly, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('name email _id');
    res.status(200).json(workers);
  } catch (error) {
    console.error("❌ Error fetching workers:", error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// ✅ Route to fetch all tasks (Managers and Directors only)
router.get('/', protect, managerOnly, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedWorker', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ✅ Route to fetch tasks for the logged-in worker (only worker)
router.get('/worker-tasks', protect, workerOnly, async (req, res) => {
  try {
    const workerId = req.user._id;
    console.log(`✅ [WORKER] Fetching tasks for Worker ${workerId}`);
    const tasks = await Task.find({ assignedWorker: workerId }).populate('assignedWorker', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching worker tasks:", error);
    res.status(500).json({ error: 'Failed to fetch worker tasks' });
  }
});

// ✅ Route to create a new task (Managers and Directors only)
router.post('/', protect, managerOnly, async (req, res) => {
  const { name, description, assignedWorker } = req.body;

  if (!name) return res.status(400).json({ error: 'Task name is required' });

  try {
    const worker = await User.findById(assignedWorker);
    if (!worker || worker.role !== 'worker') {
      return res.status(400).json({ error: 'Invalid assigned worker' });
    }

    const newTask = await Task.create({
      name,
      description,
      assignedWorker,
      status: 'To Do',
      initialSeconds: 0
    });

    console.log(`✅ Task created: ${newTask._id} assigned to Worker ${assignedWorker}`);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ✅ Route to update a task (Workers for their tasks, Managers, and Directors for any task)
router.put('/:taskId', protect, async (req, res) => {
  const { taskId } = req.params;
  const { status, initialSeconds } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role === 'worker' && task.assignedWorker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access Denied: You can only update your assigned tasks.' });
    }

    // ✅ Apply updates only if values are provided
    if (status) task.status = status;
    if (typeof initialSeconds === 'number' && initialSeconds >= 0) {
      task.initialSeconds = initialSeconds;
    }

    await task.save();
    console.log(`✅ Task ${taskId} updated: status=${task.status}, time=${task.initialSeconds}`);
    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ✅ Route to delete a task (Managers and Directors only)
router.delete('/:taskId', protect, managerOnly, async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log(`✅ Task ${taskId} deleted successfully`);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
