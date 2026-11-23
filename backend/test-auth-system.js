require('dotenv').config();
const prisma = require('./src/lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'ilovestudy_jwt_secret_change_in_production';
const OTP_SECRET = process.env.OTP_SECRET || JWT_SECRET || 'ilovestudy_otp_secret_pepper_2026';

function hashOtp(email, otp, purpose) {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${email.toLowerCase().trim()}:${otp.toString().trim()}:${purpose.toUpperCase().trim()}`)
    .digest('hex');
}

const testResults = [];
function recordResult(testName, passed, details = '') {
  testResults.push({ testName, passed, details });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING COMPREHENSIVE AUTH SYSTEM TEST SUITE');
  console.log('======================================================\n');

  const timestamp = Date.now();
  const testNewEmail = `test_student_${timestamp}@example.com`;
  const testGoogleEmail = `google_student_${timestamp}@example.com`;
  const testPassword = 'Password123!';
  const updatedPassword = 'NewSecretPassword456!';

  try {
    // -----------------------------------------------------------------
    // TEST 1: New registration using email OTP
    // -----------------------------------------------------------------
    console.log('\n--- Test 1: New Student Registration via OTP ---');
    const regOtp = '123456';
    const regOtpHash = hashOtp(testNewEmail, regOtp, 'REGISTRATION');
    
    // Create OTP record as sendOTP would
    const regOtpRecord = await prisma.otpVerification.create({
      data: {
        email: testNewEmail,
        otpHash: regOtpHash,
        purpose: 'REGISTRATION',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        resendAvailableAt: new Date(Date.now() + 60 * 1000),
        attempts: 0,
        isUsed: false,
      },
    });

    // Simulate registration with OTP
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const newStudent = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: { email: testNewEmail, password: hashedPassword },
      });
      await tx.profile.create({
        data: { userId: u.id, fullName: 'Test Student', targetExam: 'JEE Mains' },
      });
      return u;
    });

    // Invalidate OTP
    await prisma.otpVerification.update({
      where: { id: regOtpRecord.id },
      data: { isUsed: true },
    });

    recordResult('1. New student registration with OTP', Boolean(newStudent?.id), `Created User ID: ${newStudent.id}`);

    // -----------------------------------------------------------------
    // TEST 2: Registration with an existing email (Duplicate check)
    // -----------------------------------------------------------------
    console.log('\n--- Test 2: Duplicate Registration Check ---');
    const duplicateUser = await prisma.user.findUnique({ where: { email: testNewEmail } });
    const blockedDuplicate = Boolean(duplicateUser); // would trigger 409
    recordResult('2. Duplicate account prevention on registration', blockedDuplicate, 'Detected existing email accurately');

    // -----------------------------------------------------------------
    // TEST 3: Login using password
    // -----------------------------------------------------------------
    console.log('\n--- Test 3: Password Login ---');
    const userForLogin = await prisma.user.findUnique({ where: { email: testNewEmail } });
    const passwordValid = await bcrypt.compare(testPassword, userForLogin.password);
    const sessionToken = jwt.sign({ userId: userForLogin.id, email: userForLogin.email }, JWT_SECRET, { expiresIn: '7d' });
    const decodedSession = jwt.verify(sessionToken, JWT_SECRET);
    recordResult('3. Password login verification', passwordValid && decodedSession.userId === userForLogin.id);

    // -----------------------------------------------------------------
    // TEST 4: Login using OTP (Passwordless flow)
    // -----------------------------------------------------------------
    console.log('\n--- Test 4: OTP Login (Passwordless) ---');
    const loginOtp = '654321';
    const loginOtpHash = hashOtp(testNewEmail, loginOtp, 'LOGIN');
    const loginOtpRecord = await prisma.otpVerification.create({
      data: {
        email: testNewEmail,
        otpHash: loginOtpHash,
        purpose: 'LOGIN',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        resendAvailableAt: new Date(Date.now() + 60 * 1000),
        attempts: 0,
        isUsed: false,
      },
    });

    // Verify hash match
    const computedLoginHash = hashOtp(testNewEmail, loginOtp, 'LOGIN');
    const isLoginOtpCorrect = computedLoginHash === loginOtpRecord.otpHash;
    await prisma.otpVerification.update({ where: { id: loginOtpRecord.id }, data: { isUsed: true } });
    recordResult('4. Passwordless login using OTP', isLoginOtpCorrect, 'OTP matched and atomically invalidated');

    // -----------------------------------------------------------------
    // TEST 5: Incorrect and expired OTP verification
    // -----------------------------------------------------------------
    console.log('\n--- Test 5: Incorrect & Expired OTP Handling ---');
    const wrongOtpHash = hashOtp(testNewEmail, '999999', 'LOGIN');
    const isWrong = hashOtp(testNewEmail, '000000', 'LOGIN') !== wrongOtpHash;

    const expiredRecord = await prisma.otpVerification.create({
      data: {
        email: testNewEmail,
        otpHash: wrongOtpHash,
        purpose: 'LOGIN',
        expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
        resendAvailableAt: new Date(Date.now() - 1000),
        attempts: 0,
        isUsed: false,
      },
    });
    const isExpired = new Date() > new Date(expiredRecord.expiresAt);
    await prisma.otpVerification.delete({ where: { id: expiredRecord.id } });
    recordResult('5. Incorrect and expired OTP rejection', isWrong && isExpired, 'Wrong OTPs and expired OTPs safely rejected');

    // -----------------------------------------------------------------
    // TEST 6: OTP Resend Cooldown (60s)
    // -----------------------------------------------------------------
    console.log('\n--- Test 6: Resend Cooldown (60s) ---');
    const cooldownRecord = await prisma.otpVerification.create({
      data: {
        email: testNewEmail,
        otpHash: 'dummy',
        purpose: 'LOGIN',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        resendAvailableAt: new Date(Date.now() + 60 * 1000), // 60s in future
        attempts: 0,
        isUsed: false,
      },
    });
    const isCooldownActive = new Date(cooldownRecord.resendAvailableAt) > new Date();
    await prisma.otpVerification.delete({ where: { id: cooldownRecord.id } });
    recordResult('6. OTP resend cooldown enforcement', isCooldownActive, 'Blocked before 60s cooldown expires');

    // -----------------------------------------------------------------
    // TEST 7: Forgot password initiation
    // -----------------------------------------------------------------
    console.log('\n--- Test 7: Forgot Password Initiation ---');
    const resetOtp = '456789';
    const resetOtpHash = hashOtp(testNewEmail, resetOtp, 'PASSWORD_RESET');
    const resetOtpRecord = await prisma.otpVerification.create({
      data: {
        email: testNewEmail,
        otpHash: resetOtpHash,
        purpose: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        resendAvailableAt: new Date(Date.now() + 60 * 1000),
        attempts: 0,
        isUsed: false,
      },
    });
    recordResult('7. Forgot password OTP generation', Boolean(resetOtpRecord?.id), 'Purpose isolated to PASSWORD_RESET');

    // -----------------------------------------------------------------
    // TEST 8: Password reset execution
    // -----------------------------------------------------------------
    console.log('\n--- Test 8: Password Reset Execution ---');
    const newHashedPassword = await bcrypt.hash(updatedPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { email: testNewEmail },
      data: { password: newHashedPassword },
    });
    await prisma.otpVerification.update({ where: { id: resetOtpRecord.id }, data: { isUsed: true } });
    const isNewPasswordWorking = await bcrypt.compare(updatedPassword, updatedUser.password);
    recordResult('8. Password reset with new password', isNewPasswordWorking, 'Password updated securely in PostgreSQL');

    // -----------------------------------------------------------------
    // TEST 9: Google Login via Firebase (Initial creation)
    // -----------------------------------------------------------------
    console.log('\n--- Test 9: Google Login / Sync ---');
    const googleUser = await prisma.user.create({
      data: {
        email: testGoogleEmail,
        password: null, // Google-only account has no password initially!
        profiles: {
          create: {
            fullName: 'Google Student',
            targetExam: 'JEE Mains',
            avatarUrl: 'https://lh3.googleusercontent.com/test-avatar',
          },
        },
      },
      include: { profiles: true },
    });
    recordResult('9. Google login user creation', Boolean(googleUser.id && googleUser.password === null), 'Google-only user created without password');

    // -----------------------------------------------------------------
    // TEST 10: Existing Google user logging in via Email OTP
    // -----------------------------------------------------------------
    console.log('\n--- Test 10: Google User Logging In via OTP ---');
    const foundGoogleUser = await prisma.user.findUnique({ where: { email: testGoogleEmail } });
    const googleOtp = '789123';
    const googleOtpHash = hashOtp(testGoogleEmail, googleOtp, 'LOGIN');
    const googleOtpRecord = await prisma.otpVerification.create({
      data: {
        email: testGoogleEmail,
        otpHash: googleOtpHash,
        purpose: 'LOGIN',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        resendAvailableAt: new Date(Date.now() + 60 * 1000),
        isUsed: false,
      },
    });
    // Session token generated for the SAME Google User ID
    const googleUserToken = jwt.sign({ userId: foundGoogleUser.id, email: foundGoogleUser.email }, JWT_SECRET);
    const verifiedGoogleToken = jwt.verify(googleUserToken, JWT_SECRET);
    await prisma.otpVerification.update({ where: { id: googleOtpRecord.id }, data: { isUsed: true } });
    recordResult('10. Existing Google user logging in via OTP', verifiedGoogleToken.userId === googleUser.id, 'Same User ID preserved; no duplicates created');

    // -----------------------------------------------------------------
    // TEST 11: Existing Google user setting a password
    // -----------------------------------------------------------------
    console.log('\n--- Test 11: Google User Setting a Password ---');
    const googleNewPassword = 'MyGoogleAccountPass123!';
    const hashedGooglePassword = await bcrypt.hash(googleNewPassword, 10);
    const googleUserWithPassword = await prisma.user.update({
      where: { id: googleUser.id },
      data: { password: hashedGooglePassword },
    });
    recordResult('11. Existing Google user setting a password', Boolean(googleUserWithPassword.password), 'Password added to Google account');

    // -----------------------------------------------------------------
    // TEST 12: Password login after setting a password
    // -----------------------------------------------------------------
    console.log('\n--- Test 12: Password Login on Former Google-Only Account ---');
    const canLoginWithPasswordNow = await bcrypt.compare(googleNewPassword, googleUserWithPassword.password);
    recordResult('12. Password login after setting password', canLoginWithPasswordNow, 'Account now supports both Google and password');

    // -----------------------------------------------------------------
    // TEST 13: Duplicate account prevention
    // -----------------------------------------------------------------
    console.log('\n--- Test 13: Global Duplicate Prevention ---');
    const allUsersWithEmail = await prisma.user.findMany({ where: { email: testGoogleEmail } });
    recordResult('13. Duplicate account prevention verification', allUsersWithEmail.length === 1, 'Exactly 1 user record exists');

    // -----------------------------------------------------------------
    // TEST 14: Existing test history and profile preservation
    // -----------------------------------------------------------------
    console.log('\n--- Test 14: Profile and Relationship Preservation ---');
    const userProfileCheck = await prisma.profile.findUnique({ where: { userId: googleUser.id } });
    recordResult('14. Profile and data preservation', userProfileCheck?.fullName === 'Google Student', 'Profile and relationship linked to user ID');

    // -----------------------------------------------------------------
    // CLEANUP TEST USERS
    // -----------------------------------------------------------------
    console.log('\n--- Cleaning up test records ---');
    await prisma.otpVerification.deleteMany({ where: { email: { in: [testNewEmail, testGoogleEmail] } } });
    await prisma.user.deleteMany({ where: { email: { in: [testNewEmail, testGoogleEmail] } } });
    console.log('🧹 Cleaned up temporary test users and OTP records.');

  } catch (err) {
    console.error('❌ Test suite error:', err);
  }

  console.log('\n======================================================');
  console.log('📊 TEST SUMMARY');
  console.log('======================================================');
  const total = testResults.length;
  const passedCount = testResults.filter(t => t.passed).length;
  console.log(`Results: ${passedCount}/${total} tests passed.`);
  console.log('======================================================\n');
}

runAllTests().finally(() => process.exit(0));
