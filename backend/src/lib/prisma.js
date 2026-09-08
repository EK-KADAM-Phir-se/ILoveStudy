require("dotenv").config();
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
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  statement_timeout: 15000,
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