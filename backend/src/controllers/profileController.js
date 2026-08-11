const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

function formatProfile(user, streakData = null) {
  const profile = user.profiles;
  return {
    id: user.id,
    email: user.email,
    fullName: profile?.fullName ?? "",
    targetExam: profile?.targetExam ?? "JEE Mains",
    age: profile?.age ?? null,
    school: profile?.school ?? "",
    avatarUrl: profile?.avatarUrl ?? null,
    currentStreak: streakData?.currentStreak ?? profile?.currentStreak ?? 1,
    longestStreak: streakData?.longestStreak ?? profile?.longestStreak ?? 1,
    lastActiveDate: streakData?.lastActiveDate ?? (profile?.lastActiveDate ? new Date(profile.lastActiveDate).toISOString() : null),
    streakHistory: streakData?.streakHistory ?? (Array.isArray(profile?.streakHistory) ? profile.streakHistory : []),
  };
}

async function calculateStreak(userOrId, forceCheckInToday = false) {
  let user = typeof userOrId === "object" ? userOrId : null;
  const userId = user ? user.id : userOrId;

  if (!user) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true },
    });
  }

  if (!user || !user.profiles) {
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date().toISOString(),
      isActiveToday: true,
      streakHistory: [todayStr],
    };
  }

  const profile = user.profiles;

  const attempts = await prisma.testAttempt.findMany({
    where: { userId },
    select: { submittedAt: true },
  });

  const activeDatesSet = new Set();

  attempts.forEach((a) => {
    if (a.submittedAt) {
      const dStr = new Date(a.submittedAt).toISOString().split("T")[0];
      activeDatesSet.add(dStr);
    }
  });

  if (Array.isArray(profile.streakHistory)) {
    profile.streakHistory.forEach((dStr) => {
      if (dStr) activeDatesSet.add(dStr);
    });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  if (forceCheckInToday) {
    activeDatesSet.add(todayStr);
  }

  const isActiveToday = activeDatesSet.has(todayStr);

  let count = 0;
  let checkDate = new Date();
  let dateStr = checkDate.toISOString().split("T")[0];

  if (activeDatesSet.has(dateStr)) {
    while (activeDatesSet.has(dateStr)) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
      dateStr = checkDate.toISOString().split("T")[0];
    }
  } else {
    const yesterday = new Date(checkDate);
    yesterday.setDate(yesterday.getDate() - 1);
    let yDateStr = yesterday.toISOString().split("T")[0];

    if (activeDatesSet.has(yDateStr)) {
      checkDate = yesterday;
      while (activeDatesSet.has(yDateStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
        yDateStr = checkDate.toISOString().split("T")[0];
      }
    } else {
      count = 0;
    }
  }

  const sortedDates = Array.from(activeDatesSet).sort();
  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dStr of sortedDates) {
    const d = new Date(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffMs = d.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDate = d;
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
  }

  const finalCurrentStreak = Math.max(count, 0);
  const finalLongestStreak = Math.max(maxStreak, finalCurrentStreak, 1);
  const streakHistory = Array.from(activeDatesSet).sort();

  return {
    currentStreak: finalCurrentStreak,
    longestStreak: finalLongestStreak,
    lastActiveDate: profile.lastActiveDate ? new Date(profile.lastActiveDate).toISOString() : null,
    isActiveToday,
    streakHistory,
  };
}

async function updateAndGetStreak(userId, forceCheckInToday = false) {
  const streakData = await calculateStreak(userId, forceCheckInToday);

  await prisma.profile.update({
    where: { userId },
    data: {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      lastActiveDate: streakData.isActiveToday ? new Date() : undefined,
      streakHistory: streakData.streakHistory,
    },
  });

  return streakData;
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
            currentStreak: 1,
            longestStreak: 1,
            lastActiveDate: new Date(),
            streakHistory: [new Date().toISOString().split("T")[0]],
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
            currentStreak: 1,
            longestStreak: 1,
            lastActiveDate: new Date(),
            streakHistory: [new Date().toISOString().split("T")[0]],
          },
        });
        return newUser;
      });
    }

    user = await prisma.user.findUnique({
      where: { email },
      include: { profiles: true },
    });

    const streakData = await updateAndGetStreak(user.id);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      message: "Profile synced successfully.",
      token,
      profile: formatProfile(user, streakData),
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

    const streakData = await calculateStreak(user);

    return res.json({ profile: formatProfile(user, streakData) });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ error: "Failed to fetch profile." });
  }
};

exports.getStreak = async (req, res) => {
  try {
    const streakData = await calculateStreak(req.user.userId);
    return res.json({ streak: streakData });
  } catch (error) {
    console.error("Get Streak Error:", error);
    return res.status(500).json({ error: "Failed to fetch streak." });
  }
};

exports.checkInStreak = async (req, res) => {
  try {
    const streakData = await updateAndGetStreak(req.user.userId, true);
    return res.json({ message: "Check-in recorded successfully!", streak: streakData });
  } catch (error) {
    console.error("Check In Error:", error);
    return res.status(500).json({ error: "Failed to record check-in." });
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

exports.getTestAttempts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const attempts = await prisma.testAttempt.findMany({
      where: { userId },
      include: {
        shift: {
          select: {
            id: true,
            name: true,
            exam: {
              select: { name: true }
            },
            _count: {
              select: { questions: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'asc' }
    });

    const highestScoresByExam = {};
    let overallMaxScore = 0;
    let totalPctSum = 0;

    const formattedAttempts = attempts.map((attempt) => {
      const examName = attempt.shift?.exam?.name || "JEE Main";
      const shiftName = attempt.shift?.name || "Shift Paper";
      const questionCount = attempt.shift?._count?.questions || 75;
      
      const maxMarks = questionCount > 0 ? questionCount * 4 : 300;

      const score = attempt.score;
      const percentage = Math.max(0, parseFloat(((score / maxMarks) * 100).toFixed(1)));
      totalPctSum += percentage;

      if (!highestScoresByExam[examName] || score > highestScoresByExam[examName].score) {
        highestScoresByExam[examName] = {
          score,
          maxMarks,
          percentage,
          shiftName,
          date: attempt.submittedAt
        };
      }

      // Also map "JEE Main" to "JEE Mains" and vice versa for robust lookup
      const altExamName = examName.toLowerCase().replace(/s$/, "") === "jee main"
        ? (examName.toLowerCase().endsWith("s") ? "JEE Main" : "JEE Mains")
        : null;
      if (altExamName && (!highestScoresByExam[altExamName] || score > highestScoresByExam[altExamName].score)) {
        highestScoresByExam[altExamName] = {
          score,
          maxMarks,
          percentage,
          shiftName,
          date: attempt.submittedAt
        };
      }

      if (score > overallMaxScore) {
        overallMaxScore = score;
      }

      let correctCount = 0;
      let incorrectCount = 0;
      let unattemptedCount = 0;

      if (attempt.answersSaved && typeof attempt.answersSaved === 'object') {
        const metrics = Object.values(attempt.answersSaved);
        metrics.forEach((m) => {
          if (m.selected) {
            if (m.isCorrect) correctCount++;
            else incorrectCount++;
          } else {
            unattemptedCount++;
          }
        });
      }

      return {
        id: attempt.id,
        examName,
        shiftName,
        score,
        maxMarks,
        percentage,
        submittedAt: attempt.submittedAt,
        correctCount,
        incorrectCount,
        unattemptedCount
      };
    });

    const averagePercentage = attempts.length > 0 
      ? parseFloat((totalPctSum / attempts.length).toFixed(1)) 
      : 0;

    return res.json({
      performance: {
        highestScoresByExam,
        overallMaxScore,
        totalTestsTaken: attempts.length,
        averagePercentage,
        attempts: formattedAttempts
      }
    });
  } catch (error) {
    console.error("Get Test Attempts Error:", error);
    return res.status(500).json({ error: "Failed to fetch test attempt history." });
  }
};

