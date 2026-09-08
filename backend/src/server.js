const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Import routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const testRoutes = require('./routes/testRoutes');
const profileRoutes = require('./routes/profileRoutes');
const reportRoutes = require('./routes/reportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const orgRoutes = require('./routes/orgRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

// 3. Mount the API routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/test', testRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/upload', uploadRoutes);

// Optional static uploads directory fallback
const UPLOAD_BASE_DIR = process.env.UPLOAD_BASE_DIR || '/var/www/ilovestudy/uploads';
app.use('/uploads', express.static(UPLOAD_BASE_DIR));

// Health check route with database ping
app.get('/health', async (req, res) => {
  try {
    const prisma = require('./lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "healthy", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", database: "disconnected", error: err.message });
  }
});

// Centralized Express error handler
app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err);
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    });
  }
});

// Start listening
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is roaring to go on port ${PORT}`);
});

server.keepAliveTimeout = 30000;
server.headersTimeout = 35000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`👉 Stop the process occupying port ${PORT} or choose another port.`);
    process.exit(1);
  } else {
    console.error('❌ Server Error:', err);
  }
});