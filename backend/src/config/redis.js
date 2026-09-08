const Redis = require('ioredis');
// NOTE: dotenv is already loaded in server.js; do not call dotenv.config() here

let client = null;
let isMock = true;
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
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 500,
    commandTimeout: 500,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 1) return null;
      return 200;
    }
  });

  client.connect().then(() => {
    isMock = false;
    console.log('⚡ Redis memory engine connected successfully!');
  }).catch((err) => {
    isMock = true;
    console.warn('⚠️ Local Redis server is not running. Using fast in-memory mock Redis database instead.');
  });

  client.on('error', (err) => {
    isMock = true;
  });
} catch (e) {
  isMock = true;
  console.warn('⚠️ Failed to initialize Redis client. Using fast in-memory mock Redis database instead.');
}

// Proxied Client that routes calls to either local Redis or the mock in-memory database instantly
const proxiedClient = {
  async set(...args) {
    if (isMock || !client) return mockClient.set(...args);
    try {
      return await client.set(...args);
    } catch (e) {
      isMock = true;
      return mockClient.set(...args);
    }
  },
  async get(...args) {
    if (isMock || !client) return mockClient.get(...args);
    try {
      return await client.get(...args);
    } catch (e) {
      isMock = true;
      return mockClient.get(...args);
    }
  },
  async hset(...args) {
    if (isMock || !client) return mockClient.hset(...args);
    try {
      return await client.hset(...args);
    } catch (e) {
      isMock = true;
      return mockClient.hset(...args);
    }
  },
  async hgetall(...args) {
    if (isMock || !client) return mockClient.hgetall(...args);
    try {
      return await client.hgetall(...args);
    } catch (e) {
      isMock = true;
      return mockClient.hgetall(...args);
    }
  },
  async del(...keys) {
    if (isMock || !client) return mockClient.del(...keys);
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