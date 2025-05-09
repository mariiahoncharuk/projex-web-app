// src/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task name is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assigned worker is required.'],
  },
  initialSeconds: {
    type: Number,
    default: 0,
    min: [0, 'Initial time cannot be negative.'],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Task must belong to a project.']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// ✅ Pre-save validation for assignedWorker
taskSchema.pre('save', async function (next) {
  if (this.assignedWorker) {
    const User = mongoose.model('User');
    const workerExists = await User.findById(this.assignedWorker);
    if (!workerExists || workerExists.role !== 'worker') {
      return next(new Error('Invalid assigned worker'));
    }
  }
  next();
});

// ✅ Static Method to Fetch Tasks by Project (Reusable)
taskSchema.statics.getTasksByProject = async function (projectId) {
  return this.find({ project: projectId }).populate('assignedWorker', 'name email');
};

// ✅ Static Method to Fetch Tasks by User (Worker)
taskSchema.statics.getTasksByUser = async function (userId) {
  return this.find({ assignedWorker: userId }).populate('assignedWorker', 'name email').populate('project', 'name');
};

// ✅ Middleware: Cascade Delete Tasks when Project is Deleted
taskSchema.pre('remove', async function (next) {
  const Project = mongoose.model('Project');
  await Project.updateOne(
    { tasks: this._id },
    { $pull: { tasks: this._id } }
  );
  next();
});

module.exports = mongoose.model('Task', taskSchema);
