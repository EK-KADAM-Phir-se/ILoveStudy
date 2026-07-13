const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract token from the HTTP Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN_STRING"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No authentication token provided." });
  }

  try {
    // Decode and verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId; // Inject user ID directly into the request object
    next(); // Pass control to the next function (the controller)
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired session token. Please log in again." });
  }
};