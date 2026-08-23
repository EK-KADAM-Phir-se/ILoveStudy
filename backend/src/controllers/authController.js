const prisma = require("../lib/prisma");
// const prisma = new PrismaClient(); // Connects to your PostgreSQL database directly
const bcrypt = require('bcryptjs'); //  Use the installed bcryptjs package!
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis'); // Your ioredis config
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (Used for OTP sending)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Uses your 16-character App Password
  },
});

// ==========================================
// 1. REGISTER NEW USER
// ==========================================
exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          fullName,
        },
      });

      return user;
    });

    return res.status(201).json({
      message: "User registered successfully!",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
};

// ==========================================
// 2. SEND OTP (For verification/login/password resets)
// ==========================================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate a 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let otpSaved = false;
    try {
      otpSaved = await redisClient.set(`otp:${cleanEmail}`, otp, 'EX', 300);
    } catch (redisError) {
      console.error('Redis OTP Save Warning:', redisError);
    }

    // Always log OTP to terminal for easy debugging & fallback
    console.log(`\n========================================`);
    console.log(`🔑 [OTP CODE] Generated for ${cleanEmail}: ${otp}`);
    console.log(`========================================\n`);

    // Attempt to send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: `"ILoveStudy" <${process.env.EMAIL_USER}>`,
        to: cleanEmail,
        subject: "Your ILoveStudy Verification Code",
        text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">ILoveStudy Verification Code</h2>
            <p>Use the 6-digit code below to log in or verify your account:</p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; padding: 12px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 13px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.warn("⚠️ Note: Gmail rejected the password (you need a 16-character Google App Password in backend/.env). Use the OTP printed above in the terminal.");
      }
    }

    return res.status(200).json({ message: "Verification code sent to your email!" });
  } catch (error) {
    console.error("Error in sendOTP pipeline:", error);
    return res.status(500).json({ error: "Failed to send verification code." });
  }
};

// ==========================================
// 2.1 VERIFY OTP & LOGIN (Passwordless Flow)
// ==========================================
exports.verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp, fullName } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // 1. Retrieve OTP from Redis (or mock memory store)
    let savedOtp = null;
    try {
      savedOtp = await redisClient.get(`otp:${cleanEmail}`);
    } catch (redisErr) {
      console.error("Redis get OTP error:", redisErr);
    }

    if (!savedOtp || savedOtp !== cleanOtp) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // 2. Find or create user in PostgreSQL
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profiles: true },
    });

    if (!user) {
      const displayName = fullName?.trim() || cleanEmail.split('@')[0] || "User";
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          profiles: {
            create: {
              fullName: displayName,
              targetExam: "JEE Mains",
            },
          },
        },
        include: { profiles: true },
      });
    }

    // 3. Clear the OTP from Redis
    try {
      await redisClient.del(`otp:${cleanEmail}`);
    } catch (e) {}

    // 4. Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profiles?.fullName || cleanEmail.split('@')[0] || "User",
      },
    });
  } catch (error) {
    console.error("OTP Login Error:", error);
    return res.status(500).json({ error: "Internal server error during OTP verification." });
  }
};

// ==========================================
// 3. LOGIN (Password-Only Flow)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check basic inputs
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required to log in." });
    }

    // Find user inside PostgreSQL database
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profiles: true } // Fetches profile relation if it exists
    });

    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate JWT secure token valid for 7 days
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profiles?.fullName || "User"
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error during login." });
  }
};

// ==========================================
// 4. GOOGLE AUTH SYNC
// ==========================================
exports.googleSync = async (req, res) => {
  try {
    const { email, fullName, avatarUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = fullName?.trim() || cleanEmail.split('@')[0] || "User";

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profiles: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          profiles: {
            create: {
              fullName: displayName,
              avatarUrl: avatarUrl || null,
              targetExam: "JEE Mains"
            }
          }
        },
        include: { profiles: true }
      });
    } else if (user.profiles && (avatarUrl || displayName)) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          fullName: displayName,
          ...(avatarUrl ? { avatarUrl } : {})
        }
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Google authentication synced successfully!",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profiles?.fullName || displayName
      }
    });
  } catch (error) {
    console.error("Google Sync Error:", error);
    return res.status(500).json({ error: "Internal server error during Google sync." });
  }
};