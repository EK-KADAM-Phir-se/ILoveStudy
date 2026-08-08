const redisClient = require('../config/redis');
const prisma = require("../lib/prisma");
// 1. Save mid-test question answer and current elapsed time to Redis cache
exports.saveAnswerToCache = async (req, res) => {
  try {
    const { shiftId, questionId, selectedOption, timeSpent } = req.body;
    const userId = req.userId; // Pulled directly from our verification middleware

    if (!shiftId || !questionId) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Design a unique Redis Key for this specific user's active attempt session
    const redisAnswersKey = `active_test:${userId}:${shiftId}:answers`;
    const redisTimersKey = `active_test:${userId}:${shiftId}:timers`;

    // Save selected choice option to a Redis Hash table Map
    if (selectedOption) {
      await redisClient.hset(redisAnswersKey, questionId, selectedOption);
    }

    // Save updated total elapsed seconds spent on this question to a second Redis Hash map
    if (timeSpent !== undefined) {
      await redisClient.hset(redisTimersKey, questionId, timeSpent.toString());
    }

    res.json({ status: "Success", message: "Progress saved instantly to memory cache." });
  } catch (error) {
    console.error("Redis Cache Save Error:", error);
    res.status(500).json({ error: "Failed to process real-time answer update." });
  }
};

// 2. Fetch active test snapshot state (Useful if student reloads their browser page)
exports.getTestSnapshot = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const userId = req.userId;

    const redisAnswersKey = `active_test:${userId}:${shiftId}:answers`;
    const redisTimersKey = `active_test:${userId}:${shiftId}:timers`;

    // Fetch entire maps out of Redis memory in one millisecond step
    const savedAnswers = await redisClient.hgetall(redisAnswersKey);
    const savedTimers = await redisClient.hgetall(redisTimersKey);

    res.json({
      shiftId,
      answers: savedAnswers || {},
      timers: savedTimers || {}
    });
  } catch (error) {
    console.error("Redis Cache Fetch Error:", error);
    res.status(500).json({ error: "Failed to retrieve active session state." });
  }
};

// 3. Submit entire exam, evaluate marks against master key, and save to PostgreSQL
exports.submitTest = async (req, res) => {
  try {
    const { shiftId } = req.body;
    const userId = req.userId;

    const redisAnswersKey = `active_test:${userId}:${shiftId}:answers`;
    const redisTimersKey = `active_test:${userId}:${shiftId}:timers`;

    // 1. Fetch user inputs from Redis cache
    const userAnswers = await redisClient.hgetall(redisAnswersKey);
    const userTimers = await redisClient.hgetall(redisTimersKey);

    const activeAnswers = userAnswers || {};
    const activeTimers = userTimers || {};

    // 2. Fetch the master correct answer key from PostgreSQL
    const officialQuestions = await prisma.question.findMany({
      where: { shiftId }
    });

    let finalScore = 0;
    const evaluationMetrics = {};

    // 3. Evaluate each answer
    officialQuestions.forEach((q) => {
      const selectedOption = activeAnswers[q.id];
      const timeSpentOnQuestion = parseInt(activeTimers[q.id] || "0", 10);

      evaluationMetrics[q.id] = {
        selected: selectedOption || null,
        timeSpentSeconds: timeSpentOnQuestion,
        isCorrect: false
      };

      if (selectedOption) {
        if (selectedOption === q.correctOption) {
          finalScore += q.positiveMarks; // +4 Marks
          evaluationMetrics[q.id].isCorrect = true;
        } else {
          finalScore += q.negativeMarks; // -1 Mark
        }
      }
    });

    // 4. Save the finalized attempt bundle directly into PostgreSQL
    const cleanAttempt = await prisma.testAttempt.create({
      data: {
        userId,
        shiftId,
        score: finalScore,
        answersSaved: evaluationMetrics // Automatically saves answers & timers as optimized JSON!
      }
    });

    // 5. Clean up temporary Redis cache keys to free memory space
    await redisClient.del(redisAnswersKey, redisTimersKey);

    res.status(200).json({
      message: "Exam submitted successfully! Results locked.",
      attemptId: cleanAttempt.id,
      finalScore
    });
  } catch (error) {
    console.error("Exam Submission Error:", error);
    res.status(500).json({ error: "Failed to cleanly process exam submission." });
  }
};