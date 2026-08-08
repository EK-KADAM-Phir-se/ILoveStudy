const Redis = require('ioredis');
require('dotenv').config();

let client;
let isMock = false;
const store = {};

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
  set(...args) {
    return isMock ? mockClient.set(...args) : client.set(...args);
  },
  get(...args) {
    return isMock ? mockClient.get(...args) : client.get(...args);
  },
  hset(...args) {
    return isMock ? mockClient.hset(...args) : client.hset(...args);
  },
  hgetall(...args) {
    return isMock ? mockClient.hgetall(...args) : client.hgetall(...args);
  },
  del(...args) {
    return isMock ? mockClient.del(...args) : client.del(...args);
  },
  on(event, handler) {
    if (!isMock) client.on(event, handler);
  },
  once(event, handler) {
    if (!isMock) client.once(event, handler);
  }
};

module.exports = proxiedClient;