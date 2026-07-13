const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');


const app = express();
// Add this import near the top of src/server.js
const testRoutes = require('./routes/testRoutes');

// Mount the test routes inside src/server.js (place this right underneath app.use('/api/auth', authRoutes))
app.use('/api/test', testRoutes);
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());

// Mount the API routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: "Server is running smoothly!" });
});

app.listen(PORT, () => {
  console.log(`Server is roaring to go on port ${PORT}`);
});