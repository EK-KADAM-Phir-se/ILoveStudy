const prisma = require('../lib/prisma');
const crypto = require('crypto');

// Generate unique readable test access code e.g. "DPS-2026-X821" or "TEST-7821"
function generateAccessCode(orgCode = "TEST", subject = "") {
  const cleanOrg = (orgCode || "TEST").replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
  const cleanSub = subject ? subject.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) + "-" : "";
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${cleanOrg}-${cleanSub}${randomDigits}`;
}

// -------------------------------------------------------------
// 1. ADMIN: Organization Management
// -------------------------------------------------------------

// Create a new school or college organization
exports.createOrganization = async (req, res) => {
  try {
    const { name, code, contactEmail, contactPhone, address, logoUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Organization name is required." });
    }

    const orgCode = (code || name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)).toUpperCase();

    // Check if code already exists
    const existing = await prisma.organization.findUnique({
      where: { code: orgCode }
    });

    if (existing) {
      return res.status(400).json({ error: `An organization with code '${orgCode}' already exists.` });
    }

    const org = await prisma.organization.create({
      data: {
        name: name.trim(),
        code: orgCode,
        contactEmail: contactEmail ? contactEmail.trim() : null,
        contactPhone: contactPhone ? contactPhone.trim() : null,
        address: address ? address.trim() : null,
        logoUrl: logoUrl ? logoUrl.trim() : null
      }
    });

    return res.status(201).json({
      message: "Organization created successfully.",
      organization: org
    });
  } catch (error) {
    console.error("Create organization error:", error);
    return res.status(500).json({ error: "Failed to create organization." });
  }
};

// List all organizations with stats
exports.listOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tests: true }
        }
      }
    });

    return res.status(200).json({ organizations });
  } catch (error) {
    console.error("List organizations error:", error);
    return res.status(500).json({ error: "Failed to fetch organizations." });
  }
};

// -------------------------------------------------------------
// 2. ADMIN: Test Creation & Management
// -------------------------------------------------------------

// Create a new test for a school/college
exports.createOrgTest = async (req, res) => {
  try {
    const {
      organizationId,
      title,
      customCode,
      description,
      subject = "General",
      durationMinutes = 60,
      positiveMarks = 4,
      negativeMarks = -1,
      startTime,
      endTime,
      questions = []
    } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: "Organization is required." });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Test title is required." });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "At least one question is required for the test." });
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!org) {
      return res.status(404).json({ error: "Selected organization does not exist." });
    }

    // Determine access code
    let finalCode = (customCode || "").trim().toUpperCase();
    if (!finalCode) {
      // Auto-generate until unique
      let isUnique = false;
      while (!isUnique) {
        finalCode = generateAccessCode(org.code, subject);
        const codeExists = await prisma.orgTest.findUnique({ where: { accessCode: finalCode } });
        if (!codeExists) isUnique = true;
      }
    } else {
      const codeExists = await prisma.orgTest.findUnique({ where: { accessCode: finalCode } });
      if (codeExists) {
        return res.status(400).json({ error: `Access code '${finalCode}' is already in use. Please choose another code.` });
      }
    }

    // Create the test record
    const newTest = await prisma.orgTest.create({
      data: {
        organizationId: org.id,
        title: title.trim(),
        accessCode: finalCode,
        description: description ? description.trim() : null,
        subject: subject.trim() || "General",
        durationMinutes: parseInt(durationMinutes, 10) || 60,
        positiveMarks: parseFloat(positiveMarks) || 4,
        negativeMarks: parseFloat(negativeMarks) || -1,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        status: "ACTIVE",
      }
    });

    // Batch insert questions
    const formattedQuestions = questions.map((q, idx) => ({
      orgTestId: newTest.id,
      subject: (q.subject || subject || "General").trim(),
      questionText: (q.questionText || "").trim(),
      imageUrl: q.imageUrl || null,
      optionA: (q.optionA || "").trim(),
      optionB: (q.optionB || "").trim(),
      optionC: (q.optionC || "").trim(),
      optionD: (q.optionD || "").trim(),
      correctOption: (q.correctOption || "A").toString().trim().toUpperCase(),
      explanation: q.explanation ? q.explanation.trim() : null,
      positiveMarks: q.positiveMarks !== undefined ? parseFloat(q.positiveMarks) : (parseFloat(positiveMarks) || 4),
      negativeMarks: q.negativeMarks !== undefined ? parseFloat(q.negativeMarks) : (parseFloat(negativeMarks) || -1),
      orderIndex: idx + 1
    }));

    await prisma.orgQuestion.createMany({
      data: formattedQuestions
    });

    return res.status(201).json({
      message: "Test created successfully.",
      test: {
        id: newTest.id,
        title: newTest.title,
        accessCode: newTest.accessCode,
        organizationName: org.name,
        questionCount: formattedQuestions.length,
        durationMinutes: newTest.durationMinutes
      }
    });
  } catch (error) {
    console.error("Create Org Test error:", error);
    return res.status(500).json({ error: "Failed to create organization test." });
  }
};

// List all organization tests (optionally filtered by orgId)
exports.listOrgTests = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const where = organizationId ? { organizationId } : {};

    const tests = await prisma.orgTest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: { id: true, name: true, code: true }
        },
        _count: {
          select: {
            questions: true,
            attempts: true
          }
        }
      }
    });

    return res.status(200).json({ tests });
  } catch (error) {
    console.error("List org tests error:", error);
    return res.status(500).json({ error: "Failed to fetch organization tests." });
  }
};

// Get specific test details with questions
exports.getOrgTestDetails = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await prisma.orgTest.findUnique({
      where: { id: testId },
      include: {
        organization: true,
        questions: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: { attempts: true }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    return res.status(200).json({ test });
  } catch (error) {
    console.error("Get org test details error:", error);
    return res.status(500).json({ error: "Failed to fetch test details." });
  }
};

// -------------------------------------------------------------
// 3. ADMIN: Student Marks & Reports for School/College
// -------------------------------------------------------------

// Get all student attempts & marks for an institutional test
exports.getOrgTestResults = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await prisma.orgTest.findUnique({
      where: { id: testId },
      include: {
        organization: true,
        questions: true,
        attempts: {
          orderBy: { score: 'desc' }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    const totalAttempts = test.attempts.length;
    const scores = test.attempts.map(a => a.score);
    const avgScore = totalAttempts > 0 ? (scores.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(2) : 0;
    const maxScore = totalAttempts > 0 ? Math.max(...scores) : 0;
    const minScore = totalAttempts > 0 ? Math.min(...scores) : 0;

    // Build ranked list
    const rankedAttempts = test.attempts.map((attempt, index) => ({
      rank: index + 1,
      attemptId: attempt.id,
      studentName: attempt.studentName,
      studentEmail: attempt.studentEmail || "N/A",
      studentRollNumber: attempt.studentRollNumber || "N/A",
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
      unattemptedCount: attempt.unattemptedCount,
      submittedAt: attempt.submittedAt
    }));

    return res.status(200).json({
      test: {
        id: test.id,
        title: test.title,
        accessCode: test.accessCode,
        subject: test.subject,
        organizationName: test.organization.name,
        organizationCode: test.organization.code,
        durationMinutes: test.durationMinutes,
        totalQuestions: test.questions.length,
        maxPossibleMarks: test.questions.reduce((sum, q) => sum + (q.positiveMarks || 4), 0),
        status: test.status
      },
      analytics: {
        totalSubmissions: totalAttempts,
        averageScore: parseFloat(avgScore),
        highestScore: maxScore,
        lowestScore: minScore
      },
      results: rankedAttempts
    });
  } catch (error) {
    console.error("Get org test results error:", error);
    return res.status(500).json({ error: "Failed to fetch test results." });
  }
};

// Export student marks as CSV string
exports.exportOrgTestCSV = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await prisma.orgTest.findUnique({
      where: { id: testId },
      include: {
        organization: true,
        attempts: {
          orderBy: { score: 'desc' }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    const headers = [
      "Rank",
      "Student Name",
      "Roll Number",
      "Email",
      "Marks Obtained",
      "Total Marks",
      "Percentage (%)",
      "Correct",
      "Incorrect",
      "Unattempted",
      "Submission Date"
    ];

    const rows = test.attempts.map((attempt, index) => [
      index + 1,
      `"${(attempt.studentName || "").replace(/"/g, '""')}"`,
      `"${(attempt.studentRollNumber || "").replace(/"/g, '""')}"`,
      `"${(attempt.studentEmail || "").replace(/"/g, '""')}"`,
      attempt.score,
      attempt.maxScore,
      attempt.percentage,
      attempt.correctCount,
      attempt.incorrectCount,
      attempt.unattemptedCount,
      `"${new Date(attempt.submittedAt).toLocaleString('en-IN')}"`
    ]);

    const csvContent = [
      `"Organization: ${test.organization.name}"`,
      `"Test Title: ${test.title}"`,
      `"Test Code: ${test.accessCode}"`,
      `"Subject: ${test.subject}"`,
      "",
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Marks_${test.accessCode}_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("Export CSV error:", error);
    return res.status(500).json({ error: "Failed to export marks as CSV." });
  }
};

// -------------------------------------------------------------
// 4. STUDENT: Code Verification & Test Taking
// -------------------------------------------------------------

// Student enters access code -> Verify and return test metadata
exports.verifyStudentAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.body;

    if (!accessCode || !accessCode.trim()) {
      return res.status(400).json({ error: "Please enter an examination access code." });
    }

    const cleanCode = accessCode.trim().toUpperCase();

    const test = await prisma.orgTest.findUnique({
      where: { accessCode: cleanCode },
      include: {
        organization: {
          select: { name: true, code: true, logoUrl: true }
        },
        _count: {
          select: { questions: true }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Invalid test access code. Please check and try again." });
    }

    if (test.status === "CLOSED" || test.status === "DRAFT") {
      return res.status(403).json({ error: `This test is currently ${test.status.toLowerCase()} and cannot be accessed.` });
    }

    const now = new Date();
    if (test.startTime && now < new Date(test.startTime)) {
      return res.status(403).json({
        error: `This test has not started yet. It will open on ${new Date(test.startTime).toLocaleString('en-IN')}.`
      });
    }

    if (test.endTime && now > new Date(test.endTime)) {
      return res.status(403).json({
        error: `This test has ended on ${new Date(test.endTime).toLocaleString('en-IN')}.`
      });
    }

    return res.status(200).json({
      valid: true,
      test: {
        id: test.id,
        accessCode: test.accessCode,
        title: test.title,
        description: test.description,
        subject: test.subject,
        organizationName: test.organization.name,
        organizationCode: test.organization.code,
        durationMinutes: test.durationMinutes,
        positiveMarks: test.positiveMarks,
        negativeMarks: test.negativeMarks,
        totalQuestions: test._count.questions
      }
    });
  } catch (error) {
    console.error("Verify student access code error:", error);
    return res.status(500).json({ error: "Failed to verify access code." });
  }
};

// Student starts examination -> Get questions (without leaking correct answers)
exports.getStudentTestQuestions = async (req, res) => {
  try {
    const { accessCode } = req.params;

    if (!accessCode) {
      return res.status(400).json({ error: "Access code is required." });
    }

    const cleanCode = accessCode.trim().toUpperCase();

    const test = await prisma.orgTest.findUnique({
      where: { accessCode: cleanCode },
      include: {
        organization: {
          select: { name: true, code: true }
        },
        questions: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            subject: true,
            questionText: true,
            imageUrl: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            positiveMarks: true,
            negativeMarks: true,
            orderIndex: true
            // IMPORTANT: correctOption and explanation omitted for security during exam!
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    return res.status(200).json({
      test: {
        id: test.id,
        title: test.title,
        accessCode: test.accessCode,
        subject: test.subject,
        organizationName: test.organization.name,
        durationMinutes: test.durationMinutes,
        positiveMarks: test.positiveMarks,
        negativeMarks: test.negativeMarks,
        questions: test.questions
      }
    });
  } catch (error) {
    console.error("Get student test questions error:", error);
    return res.status(500).json({ error: "Failed to load test questions." });
  }
};

// Student submits test -> Evaluate score and save attempt
exports.submitStudentTest = async (req, res) => {
  try {
    const {
      accessCode,
      studentName,
      studentEmail,
      studentRollNumber,
      answers = {}, // { [questionId]: "A" | "B" | "C" | "D" }
      timeSpentMap = {} // { [questionId]: seconds }
    } = req.body;

    if (!accessCode) {
      return res.status(400).json({ error: "Access code is required." });
    }
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: "Student name is required to record marks." });
    }

    const cleanCode = accessCode.trim().toUpperCase();

    const test = await prisma.orgTest.findUnique({
      where: { accessCode: cleanCode },
      include: {
        organization: true,
        questions: true
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    let score = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const answersSaved = {};

    test.questions.forEach((q) => {
      const posMarks = q.positiveMarks !== undefined ? q.positiveMarks : (test.positiveMarks || 4);
      const negMarks = q.negativeMarks !== undefined ? q.negativeMarks : (test.negativeMarks || -1);

      maxScore += posMarks;

      const studentChoice = answers[q.id] || answers[q.id.toString()] || null;
      const timeSpent = timeSpentMap[q.id] || 0;

      if (!studentChoice || studentChoice.toString().trim() === "") {
        unattemptedCount++;
        answersSaved[q.id] = {
          selected: null,
          isCorrect: false,
          timeSpentSeconds: timeSpent
        };
      } else {
        const selectedTrimmed = studentChoice.toString().trim().toUpperCase();
        const correctTrimmed = q.correctOption.toString().trim().toUpperCase();

        const isCorrect = selectedTrimmed === correctTrimmed;
        if (isCorrect) {
          score += posMarks;
          correctCount++;
        } else {
          score += negMarks; // Negative marks is negative value e.g. -1
          incorrectCount++;
        }

        answersSaved[q.id] = {
          selected: selectedTrimmed,
          isCorrect,
          timeSpentSeconds: timeSpent
        };
      }
    });

    const percentage = maxScore > 0 ? Math.max(0, parseFloat(((score / maxScore) * 100).toFixed(1))) : 0;

    const attempt = await prisma.orgTestAttempt.create({
      data: {
        orgTestId: test.id,
        studentName: studentName.trim(),
        studentEmail: studentEmail ? studentEmail.trim() : null,
        studentRollNumber: studentRollNumber ? studentRollNumber.trim() : null,
        userId: req.userId || null,
        score,
        maxScore,
        percentage,
        correctCount,
        incorrectCount,
        unattemptedCount,
        answersSaved
      }
    });

    return res.status(201).json({
      message: "Test submitted successfully!",
      attemptId: attempt.id,
      result: {
        score,
        maxScore,
        percentage,
        correctCount,
        incorrectCount,
        unattemptedCount,
        testTitle: test.title,
        organizationName: test.organization.name
      }
    });
  } catch (error) {
    console.error("Submit student test error:", error);
    return res.status(500).json({ error: "Failed to submit test attempt." });
  }
};

// Student views detailed scorecard and solution review after attempt
exports.getStudentAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await prisma.orgTestAttempt.findUnique({
      where: { id: attemptId },
      include: {
        orgTest: {
          include: {
            organization: true,
            questions: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt result not found." });
    }

    const test = attempt.orgTest;
    let savedMap = {};
    if (attempt.answersSaved) {
      if (typeof attempt.answersSaved === 'string') {
        try { savedMap = JSON.parse(attempt.answersSaved); } catch (e) { savedMap = {}; }
      } else {
        savedMap = attempt.answersSaved;
      }
    }

    const reviewedQuestions = test.questions.map((q) => {
      const studentRecord = savedMap[q.id] || savedMap[q.id.toString()] || {};
      const selectedOption = studentRecord.selected || null;
      let status = "Unattempted";
      if (selectedOption) {
        status = studentRecord.isCorrect ? "Correct" : "Wrong";
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
        explanation: q.explanation,
        positiveMarks: q.positiveMarks,
        negativeMarks: q.negativeMarks,
        userAnswer: selectedOption,
        status,
        timeSpentSeconds: studentRecord.timeSpentSeconds || 0
      };
    });

    return res.status(200).json({
      attempt: {
        id: attempt.id,
        studentName: attempt.studentName,
        studentRollNumber: attempt.studentRollNumber,
        studentEmail: attempt.studentEmail,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        correctCount: attempt.correctCount,
        incorrectCount: attempt.incorrectCount,
        unattemptedCount: attempt.unattemptedCount,
        submittedAt: attempt.submittedAt,
        testTitle: test.title,
        accessCode: test.accessCode,
        organizationName: test.organization.name,
        durationMinutes: test.durationMinutes
      },
      questions: reviewedQuestions
    });
  } catch (error) {
    console.error("Get student attempt result error:", error);
    return res.status(500).json({ error: "Failed to fetch attempt result." });
  }
};

// -------------------------------------------------------------
// 5. ADMIN AUTH & WHITELIST MANAGEMENT
// -------------------------------------------------------------

// Helper to check admin status
exports.isAuthorizedAdmin = async (userId, userEmail) => {
  let email = (userEmail || "").trim().toLowerCase();
  if (!email && userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (user && user.email) email = user.email.trim().toLowerCase();
  }

  const envAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (email && envAdmins.includes(email)) return true;

  if (email) {
    const dbAdmin = await prisma.adminEmail.findUnique({ where: { email } });
    if (dbAdmin) return true;
  }

  // If no admin is configured yet in DB or ENV, initialize the first user as Superadmin
  const totalDbAdmins = await prisma.adminEmail.count();
  if (totalDbAdmins === 0 && envAdmins.length === 0 && email) {
    await prisma.adminEmail.create({ data: { email, role: "SUPERADMIN" } }).catch(() => {});
    return true;
  }

  // Allow localhost/development default if nothing is configured
  if (totalDbAdmins === 0 && envAdmins.length === 0) {
    return true;
  }

  return false;
};

// Check if currently authenticated user is an authorized admin
exports.checkAdminAccess = async (req, res) => {
  try {
    const userId = req.userId;
    let email = req.query.email || "";

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
      if (user && user.email) email = user.email;
    }

    const isAdmin = await exports.isAuthorizedAdmin(userId, email);

    return res.status(200).json({
      isAdmin,
      email: email || "anonymous"
    });
  } catch (error) {
    console.error("Check admin access error:", error);
    return res.status(500).json({ error: "Failed to check admin status." });
  }
};

// List all authorized admin emails
exports.listAdminEmails = async (req, res) => {
  try {
    const admins = await prisma.adminEmail.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const envAdmins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    return res.status(200).json({
      admins,
      envAdmins
    });
  } catch (error) {
    console.error("List admin emails error:", error);
    return res.status(500).json({ error: "Failed to fetch admin list." });
  }
};

// Add new admin email to whitelist
exports.addAdminEmail = async (req, res) => {
  try {
    const { email, role = "ADMIN" } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.adminEmail.findUnique({
      where: { email: cleanEmail }
    });

    if (existing) {
      return res.status(400).json({ error: `Email '${cleanEmail}' is already an authorized admin.` });
    }

    const admin = await prisma.adminEmail.create({
      data: {
        email: cleanEmail,
        role: role.toUpperCase(),
        addedBy: req.userId || "System Admin"
      }
    });

    return res.status(201).json({
      message: "Admin email added successfully.",
      admin
    });
  } catch (error) {
    console.error("Add admin email error:", error);
    return res.status(500).json({ error: "Failed to add admin email." });
  }
};

// Remove admin email from whitelist
exports.removeAdminEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const totalCount = await prisma.adminEmail.count();
    if (totalCount <= 1) {
      return res.status(400).json({ error: "Cannot remove the only remaining admin email." });
    }

    await prisma.adminEmail.delete({
      where: { id }
    });

    return res.status(200).json({ message: "Admin email removed successfully." });
  } catch (error) {
    console.error("Remove admin email error:", error);
    return res.status(500).json({ error: "Failed to remove admin email." });
  }
};
