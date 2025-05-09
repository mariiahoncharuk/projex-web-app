// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register User (Director, Manager)
const register = async (req, res) => {
  const { name, email, password, role, workspaceCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    if (role === 'manager' && !workspaceCode) {
      return res.status(400).json({ message: 'Managers must provide a workspace code' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      workspaceCode: role === 'manager' ? workspaceCode : ''
    });

    // ✅ Generate Access Token and Refresh Token
    const token = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // ✅ Set Refresh Token as HTTP-Only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Generate Access Token and Refresh Token
    const token = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // ✅ Set Refresh Token as HTTP-Only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("✅ [LOGIN] Login successful");
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Generate Access Token (1 hour)
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// ✅ Generate Refresh Token (7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ Refresh Token Endpoint (uses HTTP-Only Cookie)
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// ✅ Logout User (Clear HTTP-Only Cookie)
const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// ✅ Export the controllers
module.exports = { register, login, refreshToken, logout };
