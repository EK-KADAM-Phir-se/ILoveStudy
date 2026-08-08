const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

function formatProfile(user) {
  const profile = user.profiles;
  return {
    id: user.id,
    email: user.email,
    fullName: profile?.fullName ?? "",
    targetExam: profile?.targetExam ?? "JEE Mains",
    age: profile?.age ?? null,
    school: profile?.school ?? "",
    avatarUrl: profile?.avatarUrl ?? null,
  };
}

exports.syncFirebaseUser = async (req, res) => {
  try {
    const { email, fullName, avatarUrl } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ error: "Email and full name are required." });
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { profiles: true },
    });

    if (user) {
      if (user.profiles) {
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            fullName,
            ...(avatarUrl ? { avatarUrl } : {}),
          },
        });
      } else {
        await prisma.profile.create({
          data: {
            userId: user.id,
            fullName,
            avatarUrl: avatarUrl ?? null,
          },
        });
      }
    } else {
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({ data: { email } });
        await tx.profile.create({
          data: {
            userId: newUser.id,
            fullName,
            avatarUrl: avatarUrl ?? null,
          },
        });
        return newUser;
      });
    }

    user = await prisma.user.findUnique({
      where: { email },
      include: { profiles: true },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      message: "Profile synced successfully.",
      token,
      profile: formatProfile(user),
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return res.status(500).json({ error: "Failed to sync user profile." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { profiles: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ profile: formatProfile(user) });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ error: "Failed to fetch profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, targetExam, age, school } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { profiles: true },
    });

    if (!user || !user.profiles) {
      return res.status(404).json({ error: "Profile not found." });
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (targetExam !== undefined) updateData.targetExam = targetExam.trim();
    if (school !== undefined) updateData.school = school.trim();
    if (age !== undefined) {
      const parsedAge = age === "" || age === null ? null : parseInt(age, 10);
      if (parsedAge !== null && (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 100)) {
        return res.status(400).json({ error: "Age must be between 5 and 100." });
      }
      updateData.age = parsedAge;
    }

    if (updateData.fullName === "") {
      return res.status(400).json({ error: "Name cannot be empty." });
    }

    await prisma.profile.update({
      where: { userId: user.id },
      data: updateData,
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profiles: true },
    });

    return res.json({
      message: "Profile updated successfully.",
      profile: formatProfile(updatedUser),
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ error: "Failed to update profile." });
  }
};
