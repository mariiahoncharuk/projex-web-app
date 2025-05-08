// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User (Director, Manager)
const register = async (req, res) => {
  const { name, email, password, role, workspaceCode } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // If manager, make sure they provide a workspace code
    if (role === 'manager' && !workspaceCode) {
      return res.status(400).json({ message: 'Managers must provide a workspace code' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      workspaceCode: role === 'manager' ? workspaceCode : ''
    });

    // JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request received");

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Check password (using bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Login successful");
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export the controllers
module.exports = { register, login };
