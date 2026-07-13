const Redis = require('ioredis');
require('dotenv').config();

// Initialize Redis client using connection URL from environment variables
const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redisClient.on('connect', () => {
  console.log('⚡ Redis memory engine connected successfully!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

module.exports = redisClient;