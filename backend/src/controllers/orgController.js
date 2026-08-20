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

// -------------------------------------------------------------
// JSON TEST IMPORT & LIFECYCLE MANAGEMENT
// -------------------------------------------------------------

function validateTestJSONData(jsonInput) {
  const errors = [];
  let data = jsonInput;

  if (typeof jsonInput === 'string') {
    try {
      data = JSON.parse(jsonInput);
    } catch (e) {
      return { valid: false, errors: ["Invalid JSON syntax: " + e.message] };
    }
  }

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ["JSON content must be a valid JSON object."] };
  }

  const testObj = (data.test && typeof data.test === 'object') ? data.test : data;

  const title = (testObj.title || testObj.name || "").toString().trim();
  if (!title) {
    errors.push("Test: 'title' is required and must be a non-empty string.");
  }

  const durationMinutes = parseInt(testObj.duration_minutes ?? testObj.durationMinutes ?? testObj.duration, 10);
  if (isNaN(durationMinutes) || durationMinutes <= 0) {
    errors.push("Test: 'duration_minutes' must be a positive number greater than 0.");
  }

  const scheduledStart = testObj.scheduled_start || testObj.startTime || null;
  const scheduledEnd = testObj.scheduled_end || testObj.endTime || null;

  if (scheduledStart && isNaN(new Date(scheduledStart).getTime())) {
    errors.push("Test: 'scheduled_start' is not a valid datetime string.");
  }

  if (scheduledEnd && isNaN(new Date(scheduledEnd).getTime())) {
    errors.push("Test: 'scheduled_end' is not a valid datetime string.");
  }

  if (scheduledStart && scheduledEnd && !isNaN(new Date(scheduledStart).getTime()) && !isNaN(new Date(scheduledEnd).getTime())) {
    if (new Date(scheduledEnd) <= new Date(scheduledStart)) {
      errors.push("Test: 'scheduled_end' must be strictly after 'scheduled_start'.");
    }
  }

  const questions = testObj.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push("Test: 'questions' must be a non-empty array of question objects.");
  } else {
    const questionIdsSeen = new Set();

    questions.forEach((q, idx) => {
      const qNum = idx + 1;
      const qId = (q.question_id || q.id || `q${qNum}`).toString().trim();

      if (questionIdsSeen.has(qId)) {
        errors.push(`Question ${qNum} (ID '${qId}'): Duplicate question_id '${qId}'. Question IDs must be unique.`);
      } else {
        questionIdsSeen.add(qId);
      }

      const qText = (q.question_text || q.questionText || q.question || "").toString().trim();
      if (!qText) {
        errors.push(`Question ${qNum} (ID '${qId}'): 'question_text' is missing or empty.`);
      }

      let optionList = [];
      if (Array.isArray(q.options) && q.options.length > 0) {
        const optIdsSeen = new Set();
        q.options.forEach((opt, optIdx) => {
          let optId = "";
          let optText = "";
          if (typeof opt === 'object' && opt !== null) {
            optId = (opt.id || String.fromCharCode(65 + optIdx)).toString().trim().toUpperCase();
            optText = (opt.text || opt.value || "").toString().trim();
          } else {
            optId = String.fromCharCode(65 + optIdx);
            optText = String(opt).trim();
          }
          if (optIdsSeen.has(optId)) {
            errors.push(`Question ${qNum} (ID '${qId}'): Duplicate option ID '${optId}'.`);
          } else {
            optIdsSeen.add(optId);
          }
          if (!optText) {
            errors.push(`Question ${qNum} (ID '${qId}'): Option '${optId}' text is empty.`);
          }
          optionList.push({ id: optId, text: optText });
        });
      } else {
        const optA = (q.optionA || "").toString().trim();
        const optB = (q.optionB || "").toString().trim();
        const optC = (q.optionC || "").toString().trim();
        const optD = (q.optionD || "").toString().trim();

        if (optA) optionList.push({ id: "A", text: optA });
        if (optB) optionList.push({ id: "B", text: optB });
        if (optC) optionList.push({ id: "C", text: optC });
        if (optD) optionList.push({ id: "D", text: optD });
      }

      if (optionList.length < 2) {
        errors.push(`Question ${qNum} (ID '${qId}'): Must provide at least 2 options.`);
      }

      let correctAnswers = [];
      if (Array.isArray(q.correct_answer)) {
        correctAnswers = q.correct_answer.map(a => String(a).trim().toUpperCase());
      } else if (q.correct_answer !== undefined && q.correct_answer !== null) {
        correctAnswers = [String(q.correct_answer).trim().toUpperCase()];
      } else if (q.correctOption !== undefined && q.correctOption !== null) {
        correctAnswers = [String(q.correctOption).trim().toUpperCase()];
      }

      if (correctAnswers.length === 0 || !correctAnswers[0]) {
        errors.push(`Question ${qNum} (ID '${qId}'): 'correct_answer' is missing.`);
      } else {
        const availableOptIds = optionList.map(o => o.id);
        correctAnswers.forEach(ans => {
          if (!availableOptIds.includes(ans)) {
            errors.push(`Question ${qNum} (ID '${qId}'): correct_answer "${ans}" does not exist in available options (${availableOptIds.join(', ')}).`);
          }
        });
      }

      const marksVal = parseFloat(q.marks ?? q.positiveMarks ?? testObj.total_marks_per_question ?? 1);
      if (isNaN(marksVal) || marksVal < 0) {
        errors.push(`Question ${qNum} (ID '${qId}'): 'marks' must be a valid non-negative number.`);
      }
    });
  }

  const valid = errors.length === 0;

  let summary = null;
  if (testObj && Array.isArray(questions)) {
    const totalQuestions = questions.length;
    const posMarksDefault = parseFloat(testObj.total_marks_per_question || 1);
    const totalMarks = testObj.total_marks ? parseFloat(testObj.total_marks) : questions.reduce((sum, q) => sum + parseFloat(q.marks ?? q.positiveMarks ?? posMarksDefault), 0);
    const negMarking = testObj.negative_marking !== undefined ? Boolean(testObj.negative_marking) : true;
    const negVal = parseFloat(testObj.negative_marks_per_wrong_answer ?? testObj.negative_marks ?? 0.25);

    summary = {
      title,
      description: testObj.description || "",
      examType: testObj.exam_type || testObj.subject || "General",
      durationMinutes: durationMinutes || 60,
      scheduledStart: scheduledStart ? new Date(scheduledStart).toISOString() : null,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd).toISOString() : null,
      totalQuestions,
      totalMarks,
      passingMarks: testObj.passing_marks ? parseFloat(testObj.passing_marks) : null,
      negativeMarking: negMarking,
      negativeMarks: negMarking ? (negVal > 0 ? -negVal : negVal) : 0,
      instructions: Array.isArray(testObj.instructions) ? testObj.instructions : []
    };
  }

  return { valid, errors, summary, parsedTest: testObj };
}

exports.validateOrgTestJSON = async (req, res) => {
  try {
    const { jsonPayload } = req.body;
    if (!jsonPayload) {
      return res.status(400).json({ valid: false, errors: ["No JSON content provided."] });
    }
    const result = validateTestJSONData(jsonPayload);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ valid: false, errors: ["Failed to parse JSON content: " + err.message] });
  }
};

exports.importOrgTestFromJSON = async (req, res) => {
  try {
    const { organizationId, jsonPayload, customCode, startTime, endTime, status = "ACTIVE", requestId } = req.body;

    if (!organizationId || !jsonPayload) {
      return res.status(400).json({ error: "organizationId and jsonPayload are required." });
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!org) {
      return res.status(404).json({ error: "Selected organization does not exist." });
    }

    const validation = validateTestJSONData(jsonPayload);
    if (!validation.valid) {
      return res.status(400).json({
        error: "JSON Validation Failed",
        errors: validation.errors
      });
    }

    const testObj = validation.parsedTest;
    const summary = validation.summary;

    const title = summary.title;
    const subject = summary.examType || "General";
    const durationMinutes = summary.durationMinutes || 60;
    const positiveMarksDefault = parseFloat(testObj.total_marks_per_question || 4);
    const negativeMarksDefault = summary.negativeMarking ? (summary.negativeMarks || -0.25) : 0;

    let testReq = null;
    if (requestId) {
      testReq = await prisma.orgTestRequest.findUnique({ where: { id: requestId } });
    }

    const finalStartTime = startTime 
      ? new Date(startTime) 
      : (testReq && testReq.scheduledStart 
          ? testReq.scheduledStart 
          : (summary.scheduledStart ? new Date(summary.scheduledStart) : null));
          
    const finalEndTime = endTime 
      ? new Date(endTime) 
      : (testReq && testReq.scheduledEnd 
          ? testReq.scheduledEnd 
          : (summary.scheduledEnd ? new Date(summary.scheduledEnd) : null));

    let initialStatus = status.toUpperCase();
    const now = new Date();
    if (finalStartTime && finalStartTime > now && initialStatus === "ACTIVE") {
      initialStatus = "SCHEDULED";
    }

    let finalCode = (customCode || "").trim().toUpperCase();
    if (!finalCode) {
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

    const newTest = await prisma.orgTest.create({
      data: {
        organizationId: org.id,
        title,
        accessCode: finalCode,
        description: summary.description || null,
        subject,
        durationMinutes,
        positiveMarks: positiveMarksDefault,
        negativeMarks: negativeMarksDefault,
        startTime: finalStartTime,
        endTime: finalEndTime,
        status: initialStatus
      }
    });

    const questions = testObj.questions || [];
    const formattedQuestions = questions.map((q, idx) => {
      let optA = (q.optionA || "").trim();
      let optB = (q.optionB || "").trim();
      let optC = (q.optionC || "").trim();
      let optD = (q.optionD || "").trim();

      if (Array.isArray(q.options) && q.options.length > 0) {
        q.options.forEach((opt, optIdx) => {
          const text = (typeof opt === 'object' ? (opt.text || opt.value || "") : String(opt)).trim();
          const id = (typeof opt === 'object' && opt.id ? opt.id : String.fromCharCode(65 + optIdx)).toUpperCase();
          if (id === "A" || optIdx === 0) optA = text;
          else if (id === "B" || optIdx === 1) optB = text;
          else if (id === "C" || optIdx === 2) optC = text;
          else if (id === "D" || optIdx === 3) optD = text;
        });
      }

      let correct = "A";
      if (Array.isArray(q.correct_answer)) {
        correct = q.correct_answer[0] ? String(q.correct_answer[0]).toUpperCase() : "A";
      } else if (q.correct_answer) {
        correct = String(q.correct_answer).toUpperCase();
      } else if (q.correctOption) {
        correct = String(q.correctOption).toUpperCase();
      }

      const qPosMarks = q.marks !== undefined ? parseFloat(q.marks) : (q.positiveMarks !== undefined ? parseFloat(q.positiveMarks) : positiveMarksDefault);
      const qNegMarks = q.negative_marks !== undefined ? parseFloat(q.negative_marks) : (q.negativeMarks !== undefined ? parseFloat(q.negativeMarks) : negativeMarksDefault);

      return {
        orgTestId: newTest.id,
        subject: (q.subject || q.topic || subject || "General").trim(),
        questionText: (q.question_text || q.questionText || q.question || "").trim(),
        imageUrl: q.imageUrl || q.image_url || null,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        correctOption: correct,
        explanation: q.explanation ? q.explanation.trim() : null,
        positiveMarks: qPosMarks,
        negativeMarks: qNegMarks,
        orderIndex: idx + 1
      };
    });

    await prisma.orgQuestion.createMany({
      data: formattedQuestions
    });

    if (requestId) {
      await prisma.orgTestRequest.update({
        where: { id: requestId },
        data: {
          status: "CONVERTED",
          orgTestId: newTest.id
        }
      }).catch((err) => console.error("Could not link test request:", err));
    }

    return res.status(201).json({
      message: "Test published successfully!",
      test: {
        id: newTest.id,
        title: newTest.title,
        accessCode: newTest.accessCode,
        organizationName: org.name,
        organizationCode: org.code,
        questionCount: formattedQuestions.length,
        durationMinutes: newTest.durationMinutes,
        status: newTest.status,
        startTime: newTest.startTime,
        endTime: newTest.endTime
      }
    });
  } catch (error) {
    console.error("Import Org Test from JSON error:", error);
    return res.status(500).json({ error: "Failed to import and publish test." });
  }
};

exports.duplicateOrgTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await prisma.orgTest.findUnique({
      where: { id: testId },
      include: {
        organization: true,
        questions: { orderBy: { orderIndex: 'asc' } }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    let newCode = "";
    let isUnique = false;
    while (!isUnique) {
      newCode = generateAccessCode(test.organization.code, test.subject);
      const codeExists = await prisma.orgTest.findUnique({ where: { accessCode: newCode } });
      if (!codeExists) isUnique = true;
    }

    const duplicatedTest = await prisma.orgTest.create({
      data: {
        organizationId: test.organizationId,
        title: `${test.title} (Copy)`,
        accessCode: newCode,
        description: test.description,
        subject: test.subject,
        durationMinutes: test.durationMinutes,
        positiveMarks: test.positiveMarks,
        negativeMarks: test.negativeMarks,
        startTime: test.startTime,
        endTime: test.endTime,
        status: "DRAFT"
      }
    });

    if (test.questions && test.questions.length > 0) {
      const clonedQuestions = test.questions.map(q => ({
        orgTestId: duplicatedTest.id,
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
        orderIndex: q.orderIndex
      }));

      await prisma.orgQuestion.createMany({ data: clonedQuestions });
    }

    return res.status(201).json({
      message: "Test duplicated successfully.",
      test: {
        id: duplicatedTest.id,
        title: duplicatedTest.title,
        accessCode: duplicatedTest.accessCode,
        organizationName: test.organization.name,
        questionCount: test.questions.length,
        status: duplicatedTest.status
      }
    });
  } catch (error) {
    console.error("Duplicate test error:", error);
    return res.status(500).json({ error: "Failed to duplicate test." });
  }
};

exports.updateOrgTestStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const validStatuses = ["ACTIVE", "SCHEDULED", "LIVE", "ENDED", "CANCELLED", "DRAFT", "CLOSED"];
    const cleanStatus = status.toString().trim().toUpperCase();

    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({ error: `Invalid status '${cleanStatus}'.` });
    }

    const updated = await prisma.orgTest.update({
      where: { id: testId },
      data: { status: cleanStatus }
    });

    return res.status(200).json({
      message: `Test status updated to ${cleanStatus}.`,
      test: updated
    });
  } catch (error) {
    console.error("Update test status error:", error);
    return res.status(500).json({ error: "Failed to update test status." });
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
      violationsCount: attempt.violationsCount || 0,
      terminatedBySecurity: attempt.terminatedBySecurity || false,
      submittedAt: attempt.submittedAt
    }));

    // Question-wise & Topic-wise Analytics
    const questionAnalytics = test.questions.map((q, idx) => {
      let correct = 0;
      let wrong = 0;
      let unattempted = 0;

      test.attempts.forEach((att) => {
        let saved = {};
        if (att.answersSaved) {
          try {
            saved = typeof att.answersSaved === 'string' ? JSON.parse(att.answersSaved) : att.answersSaved;
          } catch (e) { saved = {}; }
        }
        const rec = saved[q.id] || saved[q.id.toString()];
        if (!rec || !rec.selected) {
          unattempted++;
        } else if (rec.isCorrect) {
          correct++;
        } else {
          wrong++;
        }
      });

      const total = totalAttempts || 1;
      return {
        questionId: q.id,
        orderIndex: idx + 1,
        questionText: q.questionText,
        subject: q.subject || test.subject || "General",
        correctPct: totalAttempts > 0 ? parseFloat(((correct / total) * 100).toFixed(1)) : 0,
        wrongPct: totalAttempts > 0 ? parseFloat(((wrong / total) * 100).toFixed(1)) : 0,
        unattemptedPct: totalAttempts > 0 ? parseFloat(((unattempted / total) * 100).toFixed(1)) : 0,
        correctCount: correct,
        wrongCount: wrong,
        unattemptedCount: unattempted
      };
    });

    const topicMap = {};
    questionAnalytics.forEach((qa) => {
      const topic = qa.subject || "General";
      if (!topicMap[topic]) {
        topicMap[topic] = { totalQuestions: 0, totalCorrect: 0, totalAttemptsPossible: 0 };
      }
      topicMap[topic].totalQuestions++;
      topicMap[topic].totalCorrect += qa.correctCount;
      topicMap[topic].totalAttemptsPossible += (totalAttempts || 0);
    });

    const topicAnalytics = Object.entries(topicMap).map(([topic, data]) => {
      const accuracyPct = data.totalAttemptsPossible > 0
        ? parseFloat(((data.totalCorrect / data.totalAttemptsPossible) * 100).toFixed(1))
        : 0;
      return {
        topic,
        totalQuestions: data.totalQuestions,
        accuracyPct
      };
    });

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
        status: test.status,
        startTime: test.startTime,
        endTime: test.endTime
      },
      analytics: {
        totalSubmissions: totalAttempts,
        averageScore: parseFloat(avgScore),
        highestScore: maxScore,
        lowestScore: minScore,
        questionAnalytics,
        topicAnalytics
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
      "Proctoring Violations",
      "Security Status",
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
      attempt.violationsCount || 0,
      `"${attempt.terminatedBySecurity ? "TERMINATED (5/5 Violations)" : (attempt.violationsCount || 0) > 0 ? "WARNINGS RECORDED" : "CLEAN"}"`,
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

    const now = new Date();

    // 1. Check if test was cancelled by admin
    if (test.status === "CANCELLED") {
      return res.status(403).json({
        error: "This examination has been cancelled by the organiser."
      });
    }

    // 2. Check if test is closed or draft
    if (test.status === "CLOSED" || test.status === "DRAFT") {
      return res.status(403).json({ error: `This test is currently ${test.status.toLowerCase()} and cannot be accessed.` });
    }

    // 3. Check if test has ended
    if (test.status === "ENDED" || (test.endTime && now > new Date(test.endTime))) {
      if (test.status !== "ENDED") {
        await prisma.orgTest.update({ where: { id: test.id }, data: { status: "ENDED" } }).catch(() => {});
      }
      return res.status(403).json({
        error: `This test has ended on ${new Date(test.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.`
      });
    }

    // 4. Check if test has not started yet (future start time)
    if (test.startTime && now < new Date(test.startTime)) {
      return res.status(200).json({
        valid: false,
        scheduled: true,
        message: `This examination is scheduled to begin at ${new Date(test.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Please return at the scheduled time.`,
        test: {
          id: test.id,
          accessCode: test.accessCode,
          title: test.title,
          organizationName: test.organization.name,
          startTime: test.startTime
        }
      });
    }

    // 5. If test was SCHEDULED but current time has reached/passed start time, auto-activate it
    if (test.status === "SCHEDULED") {
      await prisma.orgTest.update({ where: { id: test.id }, data: { status: "ACTIVE" } }).catch(() => {});
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
      timeSpentMap = {}, // { [questionId]: seconds }
      violationsCount = 0,
      terminatedBySecurity = false
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
        answersSaved,
        violationsCount: parseInt(violationsCount, 10) || 0,
        terminatedBySecurity: Boolean(terminatedBySecurity)
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

// -------------------------------------------------------------
// 6. ORGANISER & ADMIN: Test Request & PDF-to-JSON Workflow
// -------------------------------------------------------------

// Organiser submits a test request with PDF paper
exports.createOrgTestRequest = async (req, res) => {
  try {
    const {
      organizationId,
      organizationName,
      title,
      description,
      subject = "General",
      durationMinutes = 60,
      positiveMarks = 4,
      negativeMarks = -1,
      scheduledStart,
      scheduledEnd,
      expectedStudents = 50,
      pdfUrl,
      pdfFileName,
      requesterEmail: reqBodyEmail,
      requesterName: reqBodyName
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Examination title is required." });
    }

    const cleanOrgName = (organizationName || "").trim();

    let org = null;
    if (organizationId) {
      org = await prisma.organization.findUnique({ where: { id: organizationId } });
    }

    if (!org && cleanOrgName) {
      // Look up existing organization by name
      org = await prisma.organization.findFirst({
        where: { name: { equals: cleanOrgName, mode: "insensitive" } }
      });

      // If not exists, automatically create it
      if (!org) {
        const words = cleanOrgName.split(/\s+/).filter(Boolean);
        let baseCode = "";
        if (words.length === 1) {
          baseCode = words[0].slice(0, 4).toUpperCase();
        } else {
          baseCode = words.map(w => w[0]).join("").slice(0, 6).toUpperCase();
        }
        if (!baseCode || baseCode.length < 2) baseCode = "INST";

        let uniqueCode = baseCode;
        let counter = 1;
        while (await prisma.organization.findUnique({ where: { code: uniqueCode } })) {
          uniqueCode = `${baseCode}${counter++}`;
        }

        org = await prisma.organization.create({
          data: {
            name: cleanOrgName,
            code: uniqueCode,
            contactEmail: (reqBodyEmail || "").trim() || null
          }
        });
      }
    }

    if (!org) {
      return res.status(400).json({ error: "School or college name is required." });
    }

    // Resolve requester email & name
    let userEmail = (reqBodyEmail || "").trim().toLowerCase();
    let userName = (reqBodyName || "").trim();

    if (!userEmail && req.userId) {
      const u = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { profiles: true }
      });
      if (u && u.email) userEmail = u.email.trim().toLowerCase();
    }

    const requesterTag = userEmail ? `[REQUESTER:${userEmail}]` : '';
    const finalDescription = description 
      ? `${requesterTag} ${description.trim()}`.trim()
      : (requesterTag || null);

    // Validate 12-hour minimum advance scheduling rule
    let parsedStart = null;
    let parsedEnd = null;

    if (scheduledStart) {
      parsedStart = new Date(scheduledStart);
      if (isNaN(parsedStart.getTime())) {
        return res.status(400).json({ error: "Invalid scheduled start date format." });
      }

      const minAdvanceTime = new Date(Date.now() + 12 * 60 * 60 * 1000);
      if (parsedStart < minAdvanceTime) {
        return res.status(400).json({
          error: "Examination scheduled time must be at least 12 hours in the future to allow admin question paper verification and digitisation."
        });
      }

      if (scheduledEnd) {
        parsedEnd = new Date(scheduledEnd);
      } else {
        const dur = parseInt(durationMinutes, 10) || 60;
        parsedEnd = new Date(parsedStart.getTime() + dur * 60 * 1000);
      }
    }

    const testRequest = await prisma.orgTestRequest.create({
      data: {
        organizationId: org.id,
        title: title.trim(),
        description: finalDescription,
        subject: subject.trim(),
        durationMinutes: parseInt(durationMinutes, 10) || 60,
        positiveMarks: parseFloat(positiveMarks) || 4,
        negativeMarks: parseFloat(negativeMarks) || 0,
        scheduledStart: parsedStart,
        scheduledEnd: parsedEnd,
        expectedStudents: parseInt(expectedStudents, 10) || 50,
        pdfUrl: pdfUrl || null,
        pdfFileName: pdfFileName || null,
        status: "PENDING_JSON_CONVERSION"
      },
      include: {
        organization: { select: { name: true, code: true } }
      }
    });

    return res.status(201).json({
      message: "Test request submitted successfully! Admin will convert the PDF paper into an online exam.",
      testRequest
    });
  } catch (error) {
    console.error("Create test request error:", error);
    return res.status(500).json({ error: "Failed to submit test request." });
  }
};

// List all test requests for Admin
exports.listAdminTestRequests = async (req, res) => {
  try {
    const requests = await prisma.orgTestRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        organization: { select: { id: true, name: true, code: true, contactEmail: true } },
        orgTest: { select: { id: true, accessCode: true, status: true } }
      }
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("List admin test requests error:", error);
    return res.status(500).json({ error: "Failed to fetch test requests." });
  }
};

// List test requests for an Organiser (Strictly isolated: Admins see all, Organizers see only their own)
exports.listOrganiserTestRequests = async (req, res) => {
  try {
    const { organizationId, email: queryEmail } = req.query;

    let userEmail = (queryEmail || "").trim().toLowerCase();
    if (!userEmail && req.userId) {
      const u = await prisma.user.findUnique({ where: { id: req.userId }, select: { email: true } });
      if (u && u.email) userEmail = u.email.trim().toLowerCase();
    }

    // Check if the user is an authorized admin
    const isAdmin = await exports.isAuthorizedAdmin(req.userId, userEmail);

    let where = {};

    if (isAdmin) {
      // Admins see all requests (optionally filtered by organizationId)
      where = organizationId ? { organizationId } : {};
    } else if (userEmail) {
      // Organizers see ONLY their own requests (enforced by matching email tag in description)
      if (organizationId) {
        where = {
          AND: [
            { organizationId },
            { description: { contains: userEmail } }
          ]
        };
      } else {
        where = { description: { contains: userEmail } };
      }
    } else {
      // Unauthenticated / other students without organizer email see NO private requests
      return res.status(200).json({ requests: [] });
    }

    const requests = await prisma.orgTestRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        subject: true,
        durationMinutes: true,
        positiveMarks: true,
        negativeMarks: true,
        expectedStudents: true,
        scheduledStart: true,
        scheduledEnd: true,
        status: true,
        createdAt: true,
        organization: { select: { id: true, name: true, code: true, contactEmail: true } },
        orgTest: {
          select: {
            id: true,
            accessCode: true,
            status: true,
            startTime: true,
            endTime: true,
            _count: { select: { attempts: true, questions: true } }
          }
        }
      }
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("List organiser test requests error:", error);
    return res.status(500).json({ error: "Failed to fetch organiser test requests." });
  }
};

// Organiser toggles test to OPEN (flexible forever / retakes) or CLOSED
exports.toggleOrgTestOpen = async (req, res) => {
  try {
    const { testId } = req.params;
    const { isOpen } = req.body;

    const test = await prisma.orgTest.findUnique({ where: { id: testId } });
    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    const updated = await prisma.orgTest.update({
      where: { id: testId },
      data: {
        status: isOpen ? "ACTIVE" : "ENDED",
        endTime: isOpen ? null : new Date()
      }
    });

    return res.status(200).json({
      message: isOpen ? "Test is now OPEN for unlimited practice & retakes!" : "Test has been CLOSED.",
      test: updated
    });
  } catch (error) {
    console.error("Toggle test open error:", error);
    return res.status(500).json({ error: "Failed to toggle test open status." });
  }
};

// Delete a test request (Only creator or admin)
exports.deleteOrgTestRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    await prisma.orgTestRequest.delete({
      where: { id: requestId }
    });

    return res.status(200).json({ message: "Test request deleted successfully." });
  } catch (error) {
    console.error("Delete test request error:", error);
    return res.status(500).json({ error: "Failed to delete test request." });
  }
};
