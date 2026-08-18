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

// 3. Mount the API routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/test', testRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/org', orgRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: "Server is running smoothly!" });
});

// Start listening
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is roaring to go on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`👉 Stop the process occupying port ${PORT} or choose another port.`);
    process.exit(1);
  } else {
    console.error('❌ Server Error:', err);
  }
});