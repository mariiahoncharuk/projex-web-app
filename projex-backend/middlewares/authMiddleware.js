// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Protect Middleware (JWT Verification)
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error("No token provided in authorization header.");
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.error("User not found in database.");
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);

    if (error.name === 'TokenExpiredError') {
      console.log("Token expired. Attempting refresh...");
      return refreshAccessToken(req, res, next);
    } else {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
  }
};

// ✅ Refresh Access Token Function
const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.headers['x-refresh-token'];
  if (!refreshToken) {
    console.error("No refresh token provided.");
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.error("Refresh Token Error: User not found.");
      return res.status(401).json({ error: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    req.user = user;
    console.log("Access token refreshed successfully.");
    next();
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(403).json({ error: 'Failed to refresh token' });
  }
};

// ✅ Director Only Middleware
const directorOnly = (req, res, next) => {
  if (req.user?.role !== 'director') {
    console.error("Access Denied: Directors Only.");
    return res.status(403).json({ message: 'Access denied. Directors only.' });
  }
  next();
};

// ✅ Manager Only Middleware
const managerOnly = (req, res, next) => {
  if (req.user?.role !== 'manager') {
    console.error("Access Denied: Managers Only.");
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

// ✅ Worker Only Middleware
const workerOnly = (req, res, next) => {
  if (req.user?.role !== 'worker') {
    console.error("Access Denied: Workers Only.");
    return res.status(403).json({ message: 'Access denied. Workers only.' });
  }
  next();
};

// ✅ Export All Middlewares
module.exports = { protect, directorOnly, managerOnly, workerOnly, refreshAccessToken };
