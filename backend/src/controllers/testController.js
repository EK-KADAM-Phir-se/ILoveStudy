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

    try {
      // Save selected choice option to a Redis Hash table Map
      if (selectedOption) {
        await redisClient.hset(redisAnswersKey, questionId, selectedOption);
      }

      // Save updated total elapsed seconds spent on this question to a second Redis Hash map
      if (timeSpent !== undefined) {
        await redisClient.hset(redisTimersKey, questionId, timeSpent.toString());
      }
    } catch (redisError) {
      console.error('Redis cache warning during saveAnswerToCache:', redisError);
      return res.status(503).json({ error: 'Temporary caching unavailable. Please try again later.' });
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

    let savedAnswers = {};
    let savedTimers = {};

    try {
      // Fetch entire maps out of Redis memory in one millisecond step
      savedAnswers = await redisClient.hgetall(redisAnswersKey);
      savedTimers = await redisClient.hgetall(redisTimersKey);
    } catch (redisError) {
      console.error('Redis cache warning during getTestSnapshot:', redisError);
      return res.status(503).json({
        error: 'Temporary caching unavailable. Please try again later.',
      });
    }

    res.json({
      shiftId,
      answers: savedAnswers || {},
      timers: savedTimers || {},
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
    let userAnswers = {};
    let userTimers = {};
    try {
      userAnswers = await redisClient.hgetall(redisAnswersKey);
      userTimers = await redisClient.hgetall(redisTimersKey);
    } catch (redisError) {
      console.error('Redis cache warning during submitTest:', redisError);
      return res.status(503).json({
        error: 'Temporary caching unavailable. Please try again later.',
      });
    }

    const activeAnswers = userAnswers || {};
    const activeTimers = userTimers || {};

    // 2. Fetch the master correct answer key from PostgreSQL
    const officialQuestions = await prisma.question.findMany({
      where: { shiftId }
    });

    let finalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const evaluationMetrics = {};

    // Helper function to extract numerical values from option strings like "(1) 5120" -> "5120"
    const extractNumericValue = (str) => {
      if (!str) return "";
      const match = str.toString().match(/\(?[1-4]?\)?\s*(-?\d+(\.\d+)?)/);
      return match ? match[1] : str.toString().trim();
    };

    // 3. Evaluate each answer
    officialQuestions.forEach((q) => {
      const selectedOption = activeAnswers[q.id];
      const timeSpentOnQuestion = parseInt(activeTimers[q.id] || "0", 10);

      evaluationMetrics[q.id] = {
        selected: selectedOption || null,
        timeSpentSeconds: timeSpentOnQuestion,
        isCorrect: false
      };

      if (selectedOption !== undefined && selectedOption !== null && selectedOption.toString().trim() !== "") {
        const userAns = selectedOption.toString().trim();
        const correctOptKey = q.correctOption ? q.correctOption.toString().trim() : "A";

        // Determine if this is a numerical question
        const isNumerical = !q.optionA || !q.optionB || !q.optionC || !q.optionD || 
                            (extractNumericValue(q.optionA) === extractNumericValue(q.optionB));

        // Get target numerical answer from option text or correctOption key
        const targetOptionText = q[`option${correctOptKey}`] || q.optionA || "";
        const targetNumeric = extractNumericValue(targetOptionText);

        let isCorrect = false;
        if (isNumerical) {
          // Compare numerical user answer with correct numerical value
          isCorrect = userAns === targetNumeric || parseFloat(userAns) === parseFloat(targetNumeric) || userAns === correctOptKey;
        } else {
          // Standard MCQ answer comparison
          isCorrect = userAns.toUpperCase() === correctOptKey.toUpperCase() || userAns === targetNumeric;
        }

        if (isCorrect) {
          finalScore += q.positiveMarks; // +4 Marks
          evaluationMetrics[q.id].isCorrect = true;
          correctCount++;
        } else {
          finalScore += q.negativeMarks; // -1 Mark
          incorrectCount++;
        }
      } else {
        unattemptedCount++;
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

    // 6. Update user's profile streak history with today's date
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const userProfile = await prisma.profile.findUnique({ where: { userId } });
      if (userProfile) {
        const existingHistory = Array.isArray(userProfile.streakHistory) ? userProfile.streakHistory : [];
        if (!existingHistory.includes(todayStr)) {
          existingHistory.push(todayStr);
          await prisma.profile.update({
            where: { userId },
            data: {
              lastActiveDate: new Date(),
              streakHistory: existingHistory,
            },
          });
        }
      }
    } catch (e) {
      console.warn("Streak update on test submission warning:", e);
    }

    res.status(200).json({
      message: "Exam submitted successfully! Results locked.",
      attemptId: cleanAttempt.id,
      finalScore,
      correctCount,
      incorrectCount,
      unattemptedCount,
      totalQuestions: officialQuestions.length
    });
  } catch (error) {
    console.error("Exam Submission Error:", error);
    res.status(500).json({ error: "Failed to cleanly process exam submission." });
  }
};

// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to parse a single page/chunk of text with Groq AI API (includes auto-retry on 429 rate limit)
async function parseSingleTextChunk(text, subject, imagesCount, apiKey, retryCount = 0) {
  const systemPrompt = `You are a professional test creator and parser. Analyze the text chunk and return MCQs as JSON.
Format math formulas strictly in KaTeX-compatible LaTeX using $ (inline) and $$ (block display).
${imagesCount > 0 ? `If a question refers to a figure/diagram, set \`imageIndex\` to its 0-based index (0 to ${imagesCount - 1}). Otherwise set it to null.` : 'Set \`imageIndex\` to null.'}

Output strictly JSON matching this structure:
{
  "questions": [
    {
      "subject": "Physics" | "Chemistry" | "Math" | "General",
      "questionText": "...",
      "optionA": "...",
      "optionB": "...",
      "optionC": "...",
      "optionD": "...",
      "correctOption": "A" | "B" | "C" | "D",
      "positiveMarks": 4,
      "negativeMarks": -1,
      "imageIndex": null | number
    }
  ]
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.1
    })
  });

  if (response.status === 429) {
    const errText = await response.text();
    console.warn(`Rate limit hit (429) on chunk. Details: ${errText}`);
    
    if (retryCount < 5) {
      let waitMs = 15000;
      try {
        const parsed = JSON.parse(errText);
        const msg = parsed.error?.message || "";
        const match = msg.match(/try again in ([\d\.]+)s/i);
        if (match && match[1]) {
          waitMs = Math.ceil(parseFloat(match[1]) * 1000) + 1500; // Add 1.5s buffer
        }
      } catch (e) {}

      console.log(`Rate limit backoff: Sleeping for ${Math.round(waitMs / 1000)}s before retry ${retryCount + 1}...`);
      await sleep(waitMs);
      return parseSingleTextChunk(text, subject, imagesCount, apiKey, retryCount + 1);
    } else {
      throw new Error("Rate limit exceeded. Too many retries.");
    }
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error("Groq Chunk Parser Error:", errText);
    try {
      const parsedErr = JSON.parse(errText);
      if (parsedErr.error && parsedErr.error.message) {
        throw new Error(parsedErr.error.message);
      }
    } catch (e) {}
    throw new Error("Failed to communicate with Groq AI API.");
  }

  const responseData = await response.json();
  const content = responseData.choices?.[0]?.message?.content;
  if (!content) return [];

  const result = JSON.parse(content);
  return result.questions || [];
}

// 4. Generate custom test using Groq LLM completions API or direct JSON parsing
exports.generateTest = async (req, res) => {
  try {
    const { testName, subject, paperText, pages, images } = req.body;

    if (!paperText && (!pages || !Array.isArray(pages) || pages.length === 0)) {
      return res.status(400).json({ error: "Test name and paper content are required." });
    }

    if (!testName) {
      return res.status(400).json({ error: "Test name is required." });
    }

    let parsedQuestions = [];

    // Try parsing the input text as direct JSON first (bypasses LLM context length limits / rates)
    let isDirectJson = false;
    if (paperText) {
      const attemptParse = (text) => {
        const data = JSON.parse(text);
        let questions = null;
        if (data && Array.isArray(data.questions)) {
          questions = data.questions;
        } else if (Array.isArray(data)) {
          questions = data;
        }
        return questions && questions.length > 0 ? questions : null;
      };

      // 1st attempt: strict JSON parse (works for all well-formed files)
      try {
        const questions = attemptParse(paperText);
        if (questions) {
          parsedQuestions = questions;
          isDirectJson = true;
          console.log(`Successfully parsed ${parsedQuestions.length} questions directly from JSON input.`);
        }
      } catch (e) {
        // 2nd attempt: loose cleanup for JS-style object literals (unquoted keys / single quotes)
        // Only runs when strict parse fails — avoids corrupting valid JSON string values
        try {
          const looseCleaned = paperText
            .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')  // Quote unquoted object keys only
            .replace(/'([^'\n]*)'/g, '"$1"');            // Single quotes → double quotes

          const questions = attemptParse(looseCleaned);
          if (questions) {
            parsedQuestions = questions;
            isDirectJson = true;
            console.log(`Successfully parsed ${parsedQuestions.length} questions via loose JSON cleanup.`);
          }
        } catch (e2) {
          console.log("Direct JSON parsing failed, will use Groq AI. Details:", e2.message);
        }
      }
    }

    if (!isDirectJson) {
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        console.error("GROQ_API_KEY is not set in backend environment variables.");
        return res.status(500).json({ error: "AI test generation is not configured on this server." });
      }

      // Check if we have page-by-page array to avoid token limits
      if (Array.isArray(pages) && pages.length > 0) {
        console.log(`Processing page-by-page parsing for ${pages.length} pages.`);
        for (const page of pages) {
          const pageText = page.text;
          const pageNum = page.pageNum;

          if (!pageText || !pageText.trim()) continue;

          // Filter images strictly to this page
          const pageImages = Array.isArray(images)
            ? images.filter(img => img.page === pageNum)
            : [];

          console.log(`Parsing Page ${pageNum} (${pageText.length} chars) with ${pageImages.length} images...`);

          try {
            const pageQuestions = await parseSingleTextChunk(pageText, subject, pageImages.length, groqApiKey);
            
            // Map the parsed questions on this page with page-specific images
            const mappedQuestions = pageQuestions.map(q => {
              let correct = q.correctOption || "A";
              if (typeof correct === 'number') {
                const mapping = { 1: "A", 2: "B", 3: "C", 4: "D" };
                correct = mapping[correct] || "A";
              } else if (typeof correct === 'string') {
                correct = correct.trim().toUpperCase();
                if (correct.startsWith("(") && correct.endsWith(")")) {
                  correct = correct.substring(1, correct.length - 1);
                }
                if (correct.endsWith(".")) {
                  correct = correct.slice(0, -1);
                }
                const numericMapping = { "1": "A", "2": "B", "3": "C", "4": "D" };
                correct = numericMapping[correct] || correct;
              }
              if (!["A", "B", "C", "D"].includes(correct)) {
                correct = "A";
              }

              let imageUrl = null;
              let finalIdx = null;
              if (q.imageIndex !== undefined && q.imageIndex !== null) {
                const parsedIdx = parseInt(q.imageIndex, 10);
                if (!isNaN(parsedIdx)) {
                  finalIdx = parsedIdx;
                }
              }
              if (finalIdx !== null && pageImages[finalIdx]) {
                imageUrl = pageImages[finalIdx].base64;
              }

              return {
                subject: q.subject || subject || "General",
                questionText: q.questionText || "Question text missing",
                optionA: q.optionA || q.option1 || "Option A",
                optionB: q.optionB || q.option2 || "Option B",
                optionC: q.optionC || q.option3 || "Option C",
                optionD: q.optionD || q.option4 || "Option D",
                correctOption: correct,
                positiveMarks: typeof q.positiveMarks === 'number' ? q.positiveMarks : 4,
                negativeMarks: typeof q.negativeMarks === 'number' ? q.negativeMarks : -1,
                imageUrl: imageUrl
              };
            });

            parsedQuestions = parsedQuestions.concat(mappedQuestions);
          } catch (chunkErr) {
            console.error(`Error parsing Page ${pageNum}:`, chunkErr);
            return res.status(502).json({ error: `Failed on page ${pageNum}: ${chunkErr.message}` });
          }

          // Small delay between API calls to protect TPM rate limit boundaries
          await sleep(1000);
        }
      } else {
        // Fallback for single raw text pastes
        console.log("Input is single raw text paste. Parsing as single chunk...");
        try {
          const rawImages = Array.isArray(images) ? images : [];
          const singleQuestions = await parseSingleTextChunk(paperText, subject, rawImages.length, groqApiKey);
          
          parsedQuestions = singleQuestions.map(q => {
            let correct = q.correctOption || "A";
            if (typeof correct === 'number') {
              const mapping = { 1: "A", 2: "B", 3: "C", 4: "D" };
              correct = mapping[correct] || "A";
            } else if (typeof correct === 'string') {
              correct = correct.trim().toUpperCase();
              if (correct.startsWith("(") && correct.endsWith(")")) {
                correct = correct.substring(1, correct.length - 1);
              }
              if (correct.endsWith(".")) {
                correct = correct.slice(0, -1);
              }
              const numericMapping = { "1": "A", "2": "B", "3": "C", "4": "D" };
              correct = numericMapping[correct] || correct;
            }
            if (!["A", "B", "C", "D"].includes(correct)) {
              correct = "A";
            }

            let imageUrl = null;
            let finalIdx = null;
            if (q.imageIndex !== undefined && q.imageIndex !== null) {
              const parsedIdx = parseInt(q.imageIndex, 10);
              if (!isNaN(parsedIdx)) {
                finalIdx = parsedIdx;
              }
            }
            if (finalIdx !== null && rawImages[finalIdx]) {
              imageUrl = rawImages[finalIdx].base64;
            }

            return {
              subject: q.subject || subject || "General",
              questionText: q.questionText || "Question text missing",
              optionA: q.optionA || q.option1 || "Option A",
              optionB: q.optionB || q.option2 || "Option B",
              optionC: q.optionC || q.option3 || "Option C",
              optionD: q.optionD || q.option4 || "Option D",
              correctOption: correct,
              positiveMarks: typeof q.positiveMarks === 'number' ? q.positiveMarks : 4,
              negativeMarks: typeof q.negativeMarks === 'number' ? q.negativeMarks : -1,
              imageUrl: imageUrl
            };
          });
        } catch (rawErr) {
          console.error("Error parsing single chunk:", rawErr);
          return res.status(502).json({ error: `Groq AI Error: ${rawErr.message}` });
        }
      }
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(422).json({ error: "Could not parse or extract any questions from the provided content." });
    }

    // Upsert the custom exam
    let exam = await prisma.exam.findFirst({
      where: { name: "Custom Tests" }
    });
    if (!exam) {
      exam = await prisma.exam.create({
        data: { name: "Custom Tests" }
      });
    }

    // Create the test shift
    const shift = await prisma.shift.create({
      data: {
        examId: exam.id,
        name: testName,
        date: new Date()
      }
    });

    // Batch insert the questions
    const questionsToInsert = parsedQuestions.map(q => ({
      shiftId: shift.id,
      subject: q.subject,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      positiveMarks: q.positiveMarks,
      negativeMarks: q.negativeMarks,
      imageUrl: q.imageUrl
    }));

    await prisma.question.createMany({
      data: questionsToInsert
    });

    return res.status(201).json({
      message: "Custom test created successfully!",
      shiftId: shift.id,
      name: shift.name
    });
  } catch (error) {
    console.error("Custom test generation error:", error);
    return res.status(500).json({ error: "Internal server error during test generation." });
  }
};

// 5. Get comprehensive review for a specific completed test attempt
exports.getAttemptReview = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        shift: {
          include: {
            exam: true
          }
        }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: "Test attempt not found." });
    }

    const officialQuestions = await prisma.question.findMany({
      where: { shiftId: attempt.shiftId }
    });

    let answersMap = {};
    if (attempt.answersSaved) {
      if (typeof attempt.answersSaved === 'string') {
        try {
          answersMap = JSON.parse(attempt.answersSaved);
        } catch (e) {
          answersMap = {};
        }
      } else {
        answersMap = attempt.answersSaved;
      }
    }

    const extractNumericValue = (str) => {
      if (!str) return "";
      const match = str.toString().match(/\(?[1-4]?\)?\s*(-?\d+(\.\d+)?)/);
      return match ? match[1] : str.toString().trim();
    };

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const reviewedQuestions = officialQuestions.map((q) => {
      const savedInfo = answersMap[q.id] || answersMap[q.id.toString()] || {};
      const selectedOption = savedInfo.selected !== undefined && savedInfo.selected !== null
        ? savedInfo.selected.toString().trim()
        : null;

      let status = "Unattempted";
      if (selectedOption !== null && selectedOption !== "") {
        if (savedInfo.isCorrect !== undefined) {
          status = savedInfo.isCorrect ? "Correct" : "Wrong";
        } else {
          // Fallback evaluation if isCorrect is missing
          const correctOptKey = q.correctOption ? q.correctOption.toString().trim() : "A";
          const isNumerical = !q.optionA || !q.optionB || !q.optionC || !q.optionD || 
                              (extractNumericValue(q.optionA) === extractNumericValue(q.optionB));
          const targetOptionText = q[`option${correctOptKey}`] || q.optionA || "";
          const targetNumeric = extractNumericValue(targetOptionText);

          let isCorrect = false;
          if (isNumerical) {
            isCorrect = selectedOption === targetNumeric || parseFloat(selectedOption) === parseFloat(targetNumeric) || selectedOption === correctOptKey;
          } else {
            isCorrect = selectedOption.toUpperCase() === correctOptKey.toUpperCase() || selectedOption === targetNumeric;
          }
          status = isCorrect ? "Correct" : "Wrong";
        }

        if (status === "Correct") correctCount++;
        else incorrectCount++;
      } else {
        unattemptedCount++;
      }

      return {
        id: q.id,
        subject: q.subject,
        questionText: q.questionText,
        imageUrl: q.imageUrl,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        positiveMarks: q.positiveMarks,
        negativeMarks: q.negativeMarks,
        explanation: q.explanation || q.solution || null,
        userAnswer: selectedOption,
        status,
        timeSpentSeconds: savedInfo.timeSpentSeconds || 0
      };
    });

    const questionCount = officialQuestions.length;
    const maxMarks = questionCount > 0 ? questionCount * 4 : 300;
    const percentage = Math.max(0, parseFloat(((attempt.score / maxMarks) * 100).toFixed(1)));

    return res.status(200).json({
      attempt: {
        id: attempt.id,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        maxMarks,
        percentage,
        shiftName: attempt.shift?.name || "Shift Paper",
        examName: attempt.shift?.exam?.name || "JEE Main",
        correctCount,
        incorrectCount,
        unattemptedCount,
        totalQuestions: questionCount
      },
      questions: reviewedQuestions
    });
  } catch (error) {
    console.error("Get Attempt Review Error:", error);
    return res.status(500).json({ error: "Failed to fetch attempt review data." });
  }
};