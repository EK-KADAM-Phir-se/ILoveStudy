require('dotenv').config();
const prisma = require('../src/lib/prisma');

async function syncOtpTable() {
  console.log("Checking and syncing OtpVerification table non-destructively...");
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "otp_verifications" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "otpHash" TEXT NOT NULL,
        "purpose" TEXT NOT NULL,
        "attempts" INTEGER NOT NULL DEFAULT 0,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "resendAvailableAt" TIMESTAMP(3) NOT NULL,
        "isUsed" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "otp_verifications_email_purpose_idx" 
      ON "otp_verifications"("email", "purpose");
    `);

    console.log("✅ OtpVerification table synced successfully without modifying any existing tables!");
  } catch (err) {
    console.error("❌ Failed to sync OtpVerification table:", err);
  } finally {
    process.exit(0);
  }
}

syncOtpTable();
