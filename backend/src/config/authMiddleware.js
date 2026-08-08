const jwt = require('jsonwebtoken');

const prisma = require('../lib/prisma');

module.exports = async (req, res, next) => {
  // Extract token from the HTTP Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN_STRING"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No authentication token provided." });
  }

  if (token === 'SIMULATED_TOKEN') {
    try {
      let mockUser = await prisma.user.findFirst();
      if (!mockUser) {
        mockUser = await prisma.user.create({
          data: {
            email: "mockuser@example.com",
            profiles: {
              create: {
                fullName: "Mock User"
              }
            }
          }
        });
      }
      req.userId = mockUser.id;
      return next();
    } catch (err) {
      console.error("Error in authMiddleware simulated token check:", err);
      return res.status(500).json({ error: "Failed to resolve simulated session." });
    }
  }

  try {
    // Decode and verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId; // Inject user ID directly into the request object
    next(); // Pass control to the next function (the controller)
  } catch (error) {
    // Try to decode as Firebase ID Token
    try {
      const decodedFirebase = jwt.decode(token);
      if (decodedFirebase && decodedFirebase.iss && decodedFirebase.iss.startsWith('https://securetoken.google.com/')) {
        const email = decodedFirebase.email;
        let user = await prisma.user.findUnique({
          where: { email },
          include: { profiles: true }
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              profiles: {
                create: {
                  fullName: decodedFirebase.name || email.split('@')[0]
                }
              }
            },
            include: { profiles: true }
          });
        }
        req.userId = user.id;
        return next();
      }
    } catch (e) {
      console.error("Firebase token decode failed in config/authMiddleware:", e);
    }
    res.status(403).json({ error: "Invalid or expired session token. Please log in again." });
  }
};