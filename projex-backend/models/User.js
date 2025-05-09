// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['director', 'manager', 'worker'], required: true },
  workspaceCode: { type: String, default: '' }
});

// Auto-Hash Password (Always)
userSchema.pre('save', async function (next) {
  // If password is already hashed, do nothing
  if (this.isModified('password') && !this.password.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
