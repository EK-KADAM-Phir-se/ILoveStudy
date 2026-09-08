// NOTE: dotenv is loaded in server.js before this module is required.
// Do NOT call require('dotenv').config() here — dotenvx will re-parse .env
// and expand variables like $aAJn in the password, mangling DATABASE_URL.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const pool = new Pool({
  connectionString,
  max: 15,
  // 10s: evict idle connections before Supavisor kills them (~15-30s server-side timeout).
  // Previously 30s caused "Connection terminated unexpectedly" on stale pool connections.
  idleTimeoutMillis: 10000,
  // 8s: fail fast on dead connections so the pool can create a fresh one quickly.
  connectionTimeoutMillis: 8000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  query_timeout: 15000,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle pg client in pool:", err.message);
});

const adapter = new PrismaPg(pool, {
  onPoolError: (err) => {
    console.error("PrismaPg pool error:", err.message);
  },
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;