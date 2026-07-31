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
// 2. SEND OTP (For verification/password resets)
// ==========================================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Generate a 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with a 5-minute (300 seconds) expiration
    // Using the universal .set() method to support ioredis perfectly!
    await redisClient.set(`otp:${email}`, otp, 'EX', 300);

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Verification code sent to your email!" });
  } catch (error) {
    console.error("Error in sendOTP pipeline:", error);
    return res.status(500).json({ error: "Failed to send verification code." });
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

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate JWT secure token valid for 1 day
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
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