const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express application first!
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware configuration
app.use(cors());
app.use(express.json());

// 2. Import routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const testRoutes = require('./routes/testRoutes');

// 3. Mount the API routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/test', testRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: "Server is running smoothly!" });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is roaring to go on port ${PORT}`);
});