const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json()); // Allows backend to parse JSON data sent by frontend

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: "Server is running smoothly!" });
});

app.listen(PORT, () => {
  console.log(`Server is roaring to go on port ${PORT}`);
});