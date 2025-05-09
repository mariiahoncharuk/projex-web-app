// src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { protect, managerOnly, directorOnly } = require('../middlewares/authMiddleware');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// ✅ Create a New Project (Directors Only)
router.post('/', protect, directorOnly, async (req, res) => {
  const { name, description, assignedUsers } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  try {
    const newProject = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      assignedUsers: assignedUsers || []
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// ✅ Fetch All Projects (Directors Only)
router.get('/', protect, directorOnly, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('assignedUsers', 'name email');

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// ✅ Fetch Projects for Assigned Users (Managers and Workers)
router.get('/my-projects', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let projects;
    if (userRole === 'worker' || userRole === 'manager') {
      projects = await Project.find({
        assignedUsers: userId
      }).populate('createdBy', 'name email');
    } else {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching user projects:", error);
    res.status(500).json({ error: 'Failed to fetch user projects.' });
  }
});

// ✅ Update Project (Directors Only)
router.put('/:projectId', protect, directorOnly, async (req, res) => {
  const { projectId } = req.params;
  const { name, description, assignedUsers } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { name, description, assignedUsers },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Error updating project:", error);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// ✅ Delete Project (Directors Only)
router.delete('/:projectId', protect, directorOnly, async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // ✅ Delete all tasks associated with the project
    await Task.deleteMany({ project: projectId });
    await project.deleteOne();

    res.status(200).json({ message: 'Project and its tasks deleted successfully.' });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// ✅ Assign Users to Project (Directors Only)
router.post('/:projectId/assign-users', protect, directorOnly, async (req, res) => {
  const { projectId } = req.params;
  const { assignedUsers } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // ✅ Ensure all assigned users exist
    const users = await User.find({ _id: { $in: assignedUsers } });
    if (users.length !== assignedUsers.length) {
      return res.status(400).json({ error: 'One or more users are invalid.' });
    }

    project.assignedUsers = assignedUsers;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Error assigning users to project:", error);
    res.status(500).json({ error: 'Failed to assign users.' });
  }
});

module.exports = router;
