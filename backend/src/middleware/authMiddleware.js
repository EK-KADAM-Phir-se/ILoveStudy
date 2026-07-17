const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get the token from the request header
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Extract the token (removing "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // 3. Attach the decoded user payload to the request object
    req.user = decoded; 
    
    // Pass control to the next handler
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};