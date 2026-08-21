const fs = require('fs');
const path = require('path');
const prisma = require('../lib/prisma');

async function migrateFirebaseUsers() {
  console.log('🚀 Starting Firebase User Migration to Utho Cloud PostgreSQL...');

  const filePath = path.resolve(__dirname, '../../users.json');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: users.json file not found at ${filePath}`);
    console.log('Please place your exported users.json file in the backend directory.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  let users = [];
  try {
    const parsedData = JSON.parse(rawData);
    users = parsedData.users || parsedData;
  } catch (parseErr) {
    console.error('❌ Failed to parse users.json:', parseErr.message);
    process.exit(1);
  }

  console.log(`📦 Found ${users.length} user records to migrate.`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const fUser of users) {
    const email = fUser.email ? fUser.email.trim().toLowerCase() : null;
    const phoneNumber = fUser.phoneNumber ? fUser.phoneNumber.trim() : null;
    const fullName = fUser.displayName || (email ? email.split('@')[0] : 'User');

    if (!email && !phoneNumber) {
      console.warn(`⚠️ Skipping user UID ${fUser.localId || fUser.uid}: Missing email and phone.`);
      skippedCount++;
      continue;
    }

    try {
      // Check if user already exists in PostgreSQL
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(phoneNumber ? [{ phoneNumber }] : []),
          ],
        },
      });

      if (existingUser) {
        console.log(`⏩ Skipping existing user: ${email || phoneNumber}`);
        skippedCount++;
        continue;
      }

      // Create User and Profile records in PostgreSQL
      await prisma.user.create({
        data: {
          email,
          phoneNumber,
          password: null, // User can log in with OTP or set a password
          profiles: {
            create: {
              fullName,
              targetExam: "JEE Mains"
            },
          },
        },
      });

      migratedCount++;
      console.log(`✅ Migrated user: ${email || phoneNumber}`);
    } catch (err) {
      console.error(`❌ Failed to migrate ${email || phoneNumber}:`, err.message);
    }
  }

  console.log('\n====================================');
  console.log(`🎉 Migration Completed!`);
  console.log(`✅ Successfully Migrated: ${migratedCount}`);
  console.log(`⏩ Skipped / Already Exist: ${skippedCount}`);
  console.log('====================================\n');

  await prisma.$disconnect();
}

migrateFirebaseUsers().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
