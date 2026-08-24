const Redis = require('ioredis');
require('dotenv').config();

let client;
let isMock = false;
const store = {};

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisClient = new Redis(redisUrl, {
  lazyConnect: true,
  retryStrategy: (times) => (times >= 2 ? null : 2000),
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

const mockClient = {
  async set(key, value, mode, duration) {
    store[key] = { value, expires: mode === 'EX' ? Date.now() + duration * 1000 : null };
    return 'OK';
  },
  async get(key) {
    const entry = store[key];
    if (!entry) return null;
    if (entry.expires && entry.expires < Date.now()) {
      delete store[key];
      return null;
    }
    return entry.value;
  },
  async hset(key, field, value) {
    if (!store[key]) store[key] = { value: {} };
    store[key].value[field] = value;
    return 1;
  },
  async hgetall(key) {
    const entry = store[key];
    if (!entry) return {};
    return entry.value;
  },
  async del(...keys) {
    keys.forEach(k => delete store[k]);
    return keys.length;
  },
  on() {},
  once() {}
};

try {
  client = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 2) {
        // Stop retrying and fallback to mock
        return null;
      }
      return 500;
    }
  });

  client.on('connect', () => {
    console.log('⚡ Redis memory engine connected successfully!');
  });

  client.on('error', (err) => {
    if (!isMock) {
      console.warn('⚠️ Local Redis server is not running. Using in-memory mock Redis database instead.');
      isMock = true;
    }
  });
} catch (e) {
  console.warn('⚠️ Failed to initialize Redis client. Using in-memory mock Redis database instead.');
  isMock = true;
}

// Proxied Client that routes calls to either local Redis or the mock in-memory database
const proxiedClient = {
  async set(...args) {
    if (isMock) return mockClient.set(...args);
    try {
      return await client.set(...args);
    } catch (e) {
      isMock = true;
      return mockClient.set(...args);
    }
  },
  async get(...args) {
    if (isMock) return mockClient.get(...args);
    try {
      return await client.get(...args);
    } catch (e) {
      isMock = true;
      return mockClient.get(...args);
    }
  },
  async hset(...args) {
    if (isMock) return mockClient.hset(...args);
    try {
      return await client.hset(...args);
    } catch (e) {
      isMock = true;
      return mockClient.hset(...args);
    }
  },
  async hgetall(...args) {
    if (isMock) return mockClient.hgetall(...args);
    try {
      return await client.hgetall(...args);
    } catch (e) {
      isMock = true;
      return mockClient.hgetall(...args);
    }
  },
  async del(...keys) {
    if (isMock) return mockClient.del(...keys);
    try {
      return await client.del(...keys);
    } catch (e) {
      isMock = true;
      return mockClient.del(...keys);
    }
  },
  on(event, handler) {
    if (!isMock && client) client.on(event, handler);
  },
  once(event, handler) {
    if (!isMock && client) client.once(event, handler);
  }
};

module.exports = proxiedClient;