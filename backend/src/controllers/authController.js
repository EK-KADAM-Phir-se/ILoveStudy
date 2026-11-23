const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { sendOtpEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'ilovestudy_jwt_secret_change_in_production';
const OTP_SECRET = process.env.OTP_SECRET || JWT_SECRET || 'ilovestudy_otp_secret_pepper_2026';

// -------------------------------------------------------------
// IN-MEMORY RATE LIMITER (Protects against brute force & flooding)
// -------------------------------------------------------------
const rateLimitStore = new Map(); // key -> { count, firstRequestTime }
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6; // Max 6 OTP requests per 10 mins per IP/email

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    rateLimitStore.set(key, { count: 1, firstRequestTime: now });
    return false;
  }

  if (now - entry.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, firstRequestTime: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Clean up stale rate limiter entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}, 30 * 60 * 1000).unref();

// -------------------------------------------------------------
// HELPER: Hash OTP using HMAC SHA-256 with server pepper
// -------------------------------------------------------------
function hashOtp(email, otp, purpose) {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${email.toLowerCase().trim()}:${otp.toString().trim()}:${purpose.toUpperCase().trim()}`)
    .digest('hex');
}

// =============================================================
// 1. SEND OTP (Registration, Login, Password Reset)
// =============================================================
exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose = 'LOGIN' } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPurpose = purpose.toUpperCase().trim();

    const validPurposes = ['REGISTRATION', 'LOGIN', 'PASSWORD_RESET'];
    if (!validPurposes.includes(cleanPurpose)) {
      return res.status(400).json({ error: 'Invalid OTP purpose specified.' });
    }

    // 1. IP & Email Rate-Limiting Check
    if (isRateLimited(`ip:${clientIp}`) || isRateLimited(`email:${cleanEmail}`)) {
      return res.status(429).json({
        error: 'Too many OTP requests. Please wait 10 minutes before trying again.',
      });
    }

    // 2. Check 60-Second Cooldown against latest active OTP
    const existingActiveOtp = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        purpose: cleanPurpose,
        isUsed: false,
        resendAvailableAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingActiveOtp) {
      const waitSeconds = Math.ceil((new Date(existingActiveOtp.resendAvailableAt).getTime() - Date.now()) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSeconds}s before requesting a new code.`,
        cooldownRemaining: waitSeconds,
      });
    }

    // 3. User Existence & Purpose-Specific Pre-checks
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profiles: true },
    });

    if (cleanPurpose === 'REGISTRATION') {
      if (existingUser) {
        return res.status(409).json({
          error: 'An account with this email already exists.',
          code: 'ACCOUNT_EXISTS',
          hasPassword: Boolean(existingUser.password),
        });
      }
    } else if (cleanPurpose === 'LOGIN') {
      if (!existingUser) {
        return res.status(404).json({
          error: 'No account found with this email. Please register first.',
          code: 'ACCOUNT_NOT_FOUND',
        });
      }
    } else if (cleanPurpose === 'PASSWORD_RESET') {
      // Prevent Account Enumeration: if user doesn't exist, respond with generic success without sending email
      if (!existingUser) {
        return res.status(200).json({
          message: 'If an account exists for this email, a verification code has been sent.',
          cooldownSeconds: 60,
        });
      }
    }

    // 4. Invalidate prior active OTPs for this email and purpose
    await prisma.otpVerification.updateMany({
      where: {
        email: cleanEmail,
        purpose: cleanPurpose,
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // 5. Generate Cryptographically Secure 6-digit OTP
    const otpNumber = crypto.randomInt(100000, 1000000);
    const otp = otpNumber.toString();

    // 6. Compute HMAC Hash
    const otpHash = hashOtp(cleanEmail, otp, cleanPurpose);

    const now = Date.now();
    const expiresAt = new Date(now + 5 * 60 * 1000); // 5 minutes validity
    const resendAvailableAt = new Date(now + 60 * 1000); // 60 seconds cooldown

    // 7. Store in PostgreSQL
    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        otpHash,
        purpose: cleanPurpose,
        expiresAt,
        resendAvailableAt,
        attempts: 0,
        isUsed: false,
      },
    });

    // 8. Send Email using Resend
    await sendOtpEmail({
      to: cleanEmail,
      otp,
      purpose: cleanPurpose,
    });

    return res.status(200).json({
      message: 'Verification code sent to your email!',
      cooldownSeconds: 60,
      expiresInMinutes: 5,
    });
  } catch (error) {
    console.error('Error in sendOTP controller:', error.message || error);
    return res.status(500).json({
      error: error.message || 'Failed to send verification code. Please try again.',
    });
  }
};

// =============================================================
// 2. VERIFY OTP (Unified Verification for Login / Registration / Reset)
// =============================================================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose = 'LOGIN' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();
    const cleanPurpose = purpose.toUpperCase().trim();

    // 1. Fetch latest unused active OTP record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        purpose: cleanPurpose,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({
        error: 'No active verification code found for this email. Please request a new one.',
      });
    }

    // 2. Check Expiry
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
      return res.status(400).json({
        error: 'Verification code has expired. Please request a new one.',
      });
    }

    // 3. Check Attempts (Max 5)
    if (otpRecord.attempts >= 5) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });
      return res.status(400).json({
        error: 'Too many incorrect attempts. For security, this code has been deactivated. Please request a new code.',
      });
    }

    // 4. Verify Hash
    const expectedHash = hashOtp(cleanEmail, cleanOtp, cleanPurpose);
    if (expectedHash !== otpRecord.otpHash) {
      const updatedAttempts = otpRecord.attempts + 1;
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: updatedAttempts },
      });

      const remainingAttempts = Math.max(0, 5 - updatedAttempts);
      return res.status(400).json({
        error: remainingAttempts > 0
          ? `Incorrect code. ${remainingAttempts} attempts remaining.`
          : 'Incorrect code. Maximum attempts reached. Please request a new code.',
      });
    }

    // 5. Invalidate OTP Immediately (Atomic consumption)
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // 6. Handle Response Based on Purpose
    if (cleanPurpose === 'LOGIN') {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { profiles: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      // Generate 7-day Session Token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.profiles?.fullName || cleanEmail.split('@')[0],
          avatarUrl: user.profiles?.avatarUrl || null,
        },
      });
    }

    // For REGISTRATION or PASSWORD_RESET, generate a short-lived signed action token (15 mins)
    const actionToken = jwt.sign(
      {
        email: cleanEmail,
        purpose: cleanPurpose,
        verified: true,
        recordId: otpRecord.id,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      message: 'Verification successful!',
      verified: true,
      actionToken,
    });
  } catch (error) {
    console.error('Error in verifyOTP controller:', error.message || error);
    return res.status(500).json({ error: 'Failed to verify code. Please try again.' });
  }
};

// Backwards-compatible alias for existing frontend code
exports.verifyOTPAndLogin = exports.verifyOTP;

// =============================================================
// 3. REGISTER NEW USER (With Verified OTP / Action Token)
// =============================================================
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, otp, actionToken } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Full name, email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // 1. Double-Check Email Uniqueness
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
        code: 'ACCOUNT_EXISTS',
      });
    }

    // 2. Validate Proof of Email Ownership (via actionToken OR direct OTP)
    let isAuthorized = false;

    if (actionToken) {
      try {
        const decoded = jwt.verify(actionToken, JWT_SECRET);
        if (decoded.email === cleanEmail && decoded.purpose === 'REGISTRATION' && decoded.verified) {
          isAuthorized = true;
        }
      } catch (err) {
        // Token invalid/expired
      }
    }

    if (!isAuthorized && otp) {
      // Validate OTP directly if actionToken was omitted
      const cleanOtp = otp.toString().trim();
      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          email: cleanEmail,
          purpose: 'REGISTRATION',
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (otpRecord && otpRecord.attempts < 5) {
        const expectedHash = hashOtp(cleanEmail, cleanOtp, 'REGISTRATION');
        if (expectedHash === otpRecord.otpHash) {
          await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { isUsed: true },
          });
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return res.status(400).json({
        error: 'Email verification is required before creating an account. Please verify the code sent to your email.',
      });
    }

    // 3. Hash Password Securely with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User & Profile Atomically
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          fullName: cleanFullName,
          targetExam: 'JEE Mains',
        },
      });

      return user;
    });

    // 5. Generate 7-day Session Token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: cleanFullName,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

// =============================================================
// 4. LOGIN (Email & Password)
// =============================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profiles: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Handle Google-Only Users who have not set a password yet
    if (!user.password) {
      return res.status(400).json({
        error: "This account was created with Google and doesn't have a password. Please sign in with Google, use Email OTP, or click 'Forgot Password' to create one.",
        code: 'GOOGLE_ONLY_ACCOUNT',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate 7-day Session Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profiles?.fullName || cleanEmail.split('@')[0],
        avatarUrl: user.profiles?.avatarUrl || null,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

// =============================================================
// 5. FORGOT PASSWORD (Request Reset Code)
// =============================================================
exports.forgotPassword = async (req, res) => {
  req.body.purpose = 'PASSWORD_RESET';
  return exports.sendOTP(req, res);
};

// =============================================================
// 6. RESET PASSWORD (With Verified OTP / Action Token)
// =============================================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp, actionToken } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // 1. Verify Authorization (via actionToken OR direct OTP)
    let isAuthorized = false;

    if (actionToken) {
      try {
        const decoded = jwt.verify(actionToken, JWT_SECRET);
        if (decoded.email === cleanEmail && decoded.purpose === 'PASSWORD_RESET' && decoded.verified) {
          isAuthorized = true;
        }
      } catch (err) {
        // Token invalid/expired
      }
    }

    if (!isAuthorized && otp) {
      const cleanOtp = otp.toString().trim();
      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          email: cleanEmail,
          purpose: 'PASSWORD_RESET',
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (otpRecord && otpRecord.attempts < 5) {
        const expectedHash = hashOtp(cleanEmail, cleanOtp, 'PASSWORD_RESET');
        if (expectedHash === otpRecord.otpHash) {
          await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { isUsed: true },
          });
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return res.status(400).json({
        error: 'Verification code is invalid or expired. Please request a new code.',
      });
    }

    // 2. Find User in DB
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profiles: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    // 3. Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update User Password (works for existing Google-only accounts too!)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 5. Invalidate any remaining reset tokens for safety
    await prisma.otpVerification.updateMany({
      where: { email: cleanEmail, purpose: 'PASSWORD_RESET', isUsed: false },
      data: { isUsed: true },
    });

    return res.status(200).json({
      message: 'Password updated successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error.message || error);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
};

// =============================================================
// 7. GOOGLE AUTH SYNC (Preserved Existing Firebase Flow)
// =============================================================
exports.googleSync = async (req, res) => {
  try {
    const { email, fullName, avatarUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = fullName?.trim() || cleanEmail.split('@')[0] || 'Student';

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profiles: true },
    });

    if (!user) {
      // First time Google login -> create user and profile
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          profiles: {
            create: {
              fullName: displayName,
              avatarUrl: avatarUrl || null,
              targetExam: 'JEE Mains',
            },
          },
        },
        include: { profiles: true },
      });
    } else if (user.profiles && (avatarUrl || displayName)) {
      // User already exists -> update profile avatar if missing
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          fullName: displayName,
          ...(avatarUrl ? { avatarUrl } : {}),
        },
      });
    }

    // Issue 7-day Session Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Google authentication synced successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profiles?.fullName || displayName,
        avatarUrl: user.profiles?.avatarUrl || avatarUrl || null,
      },
    });
  } catch (error) {
    console.error('Google Sync Error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error during Google sync.' });
  }
};
