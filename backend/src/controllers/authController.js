const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber } = req.body;

    // Validate inputs
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile in a single database transaction
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phoneNumber,
        profiles: {
          create: {
            fullName,
            targetExam: "JEE"
          }
        }
      }
    });

    res.status(201).json({ message: "User registered successfully! Go ahead and log in." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error during registration." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profiles: true }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate JWT secure token valid for 1 day (plenty for a 3-hour exam)
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profiles?.fullName
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
};