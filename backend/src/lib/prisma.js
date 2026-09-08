require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // 15s to allow sufficient time for cross-region TLS handshakes
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  query_timeout: 15000, // 15s client-side query timeout
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