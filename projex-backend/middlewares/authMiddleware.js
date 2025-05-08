// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// General Protection Middleware (JWT Verification)
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (id, role) to request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

// Director Only Middleware
const directorOnly = (req, res, next) => {
  if (req.user.role !== 'director') {
    return res.status(403).json({ message: 'Access denied. Directors only.' });
  }
  next();
};

// Manager Only Middleware
const managerOnly = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

// Worker Only Middleware
const workerOnly = (req, res, next) => {
  if (req.user.role !== 'worker') {
    return res.status(403).json({ message: 'Access denied. Workers only.' });
  }
  next();
};

// Export All Middlewares
module.exports = { protect, directorOnly, managerOnly, workerOnly };
