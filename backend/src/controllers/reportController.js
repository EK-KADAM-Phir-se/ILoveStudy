const prisma = require("../lib/prisma");

const VALID_ERROR_TYPES = [
  "Wrong Question",
  "Wrong Answer",
  "Wrong Explanation",
  "Typo / Formatting",
  "Wrong Exam / Year",
  "Duplicate Question",
  "Image / Diagram Problem",
  "Other",
];

// Helper to check if a user is an admin
const checkIsAdmin = async (userId) => {
  if (!userId) return false;
  
  // 1. Check env ADMIN_EMAILS if configured
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsEnv.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) return false;

  if (adminEmails.length > 0 && user.email && adminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  // Default: Allow all logged-in users to access admin API if ADMIN_EMAILS is not set, 
  // or allow if user email contains 'admin'
  if (adminEmails.length === 0) {
    return true; 
  }

  return user.email ? user.email.toLowerCase().includes("admin") : false;
};

// ==========================================
// 1. CREATE ERROR REPORT (Authenticated User)
// ==========================================
exports.createReport = async (req, res) => {
  try {
    const { questionId, errorType, description } = req.body;
    const userId = req.user?.userId || req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    if (!questionId || !errorType || !description) {
      return res.status(400).json({ error: "Question ID, error type, and description are required." });
    }

    if (!VALID_ERROR_TYPES.includes(errorType)) {
      return res.status(400).json({ error: "Invalid error type selected." });
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 5) {
      return res.status(400).json({ error: "Please provide a slightly more detailed description (at least 5 characters)." });
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({ error: "Target question not found." });
    }

    // Check for duplicate pending reports from the same user for this question
    const existingReport = await prisma.errorReport.findFirst({
      where: {
        userId,
        questionId,
        status: { in: ["pending", "reviewing"] },
        OR: [
          { errorType },
          { description: trimmedDescription },
        ],
      },
    });

    if (existingReport) {
      return res.status(409).json({
        error: "You have already submitted a pending report for this question. Our team is currently reviewing it. Thank you!",
      });
    }

    // Create the new report
    const newReport = await prisma.errorReport.create({
      data: {
        questionId,
        userId,
        errorType,
        description: trimmedDescription,
        status: "pending",
      },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            subject: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Error reported successfully. Thank you for helping us improve this question.",
      report: newReport,
    });
  } catch (error) {
    console.error("Create Error Report Error:", error);
    return res.status(500).json({ error: error.message || "Failed to submit error report. Please try again later." });
  }
};

// ==========================================
// 2. GET USER'S REPORT HISTORY (Authenticated User)
// ==========================================
exports.getUserReports = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const reports = await prisma.errorReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            subject: true,
            shift: {
              select: {
                name: true,
                exam: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedReports = reports.map((r) => ({
      id: r.id,
      questionId: r.questionId,
      questionText: r.question.questionText,
      subject: r.question.subject,
      examName: r.question.shift?.exam?.name || "Exam",
      shiftName: r.question.shift?.name || "Shift",
      errorType: r.errorType,
      description: r.description,
      adminComment: r.adminComment,
      status: r.status,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
    }));

    return res.status(200).json({ reports: formattedReports });
  } catch (error) {
    console.error("Get User Reports Error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch user error reports." });
  }
};

// ==========================================
// 3. GET ALL REPORTS (Admin Only)
// ==========================================
exports.getAllReports = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.userId;

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin authorization required." });
    }

    const { status, exam } = req.query;

    const where = {};
    if (status && status !== "All") {
      where.status = status.toLowerCase();
    }

    const reports = await prisma.errorReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            subject: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            correctOption: true,
            imageUrl: true,
            shift: {
              select: {
                id: true,
                name: true,
                date: true,
                exam: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            profiles: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    let filteredReports = reports;
    if (exam && exam !== "All") {
      const examLower = exam.toLowerCase();
      filteredReports = reports.filter((r) => {
        const examName = r.question?.shift?.exam?.name || "";
        return examName.toLowerCase().includes(examLower);
      });
    }

    const formattedReports = filteredReports.map((r) => ({
      id: r.id,
      status: r.status,
      errorType: r.errorType,
      description: r.description,
      adminComment: r.adminComment,
      createdAt: r.createdAt,
      resolvedAt: r.resolvedAt,
      user: {
        id: r.user.id,
        email: r.user.email || "No email",
        fullName: r.user.profiles?.fullName || "Student",
      },
      question: {
        id: r.question.id,
        questionText: r.question.questionText,
        subject: r.question.subject,
        optionA: r.question.optionA,
        optionB: r.question.optionB,
        optionC: r.question.optionC,
        optionD: r.question.optionD,
        correctOption: r.question.correctOption,
        imageUrl: r.question.imageUrl,
        examName: r.question.shift?.exam?.name || "Exam",
        shiftName: r.question.shift?.name || "Shift",
        shiftDate: r.question.shift?.date,
      },
    }));

    return res.status(200).json({ reports: formattedReports });
  } catch (error) {
    console.error("Get All Reports Error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch admin error reports." });
  }
};

// ==========================================
// 4. UPDATE REPORT STATUS & COMMENT (Admin Only)
// ==========================================
exports.updateReportStatus = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.userId;
    const { id } = req.params;
    const { status, adminComment } = req.body;

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin authorization required." });
    }

    const validStatuses = ["pending", "reviewing", "resolved", "rejected"];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid report status provided." });
    }

    const existingReport = await prisma.errorReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return res.status(404).json({ error: "Report not found." });
    }

    const updateData = {};
    if (status) {
      updateData.status = status.toLowerCase();
      if (status.toLowerCase() === "resolved") {
        updateData.resolvedAt = new Date();
      }
    }
    if (adminComment !== undefined) {
      updateData.adminComment = adminComment.trim();
    }

    const updatedReport = await prisma.errorReport.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Report status updated successfully.",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update Report Status Error:", error);
    return res.status(500).json({ error: error.message || "Failed to update report status." });
  }
};
