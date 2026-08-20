const prisma = require("../lib/prisma");

// Get all exams along with their corresponding shifts
const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        shifts: true, // This automatically performs a SQL JOIN to pull in all shifts for each exam!
      },
    });
    
    return res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({ error: "Failed to retrieve exams." });
  }
};

// Get a specific shift and its questions (Protected/Private)
const getShiftDetails = async (req, res) => {
  const { shiftId } = req.params;

  try {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        questions: true, // Pulls all questions associated with this shift
      },
    });

    if (!shift) {
      return res.status(404).json({ error: "Shift not found." });
    }

    // Sort questions strictly by standard subject section order:
    // Section 1: Physics (1 - 50)
    // Section 2: Chemistry (51 - 100)
    // Section 3: Biology (101 - 200)
    const subjectOrder = {
      physics: 1,
      chemistry: 2,
      biology: 3,
      botany: 3,
      zoology: 3,
      mathematics: 4,
      maths: 4,
      math: 4,
      "general intelligence & reasoning": 1,
      "general intelligence and reasoning": 1,
      "reasoning": 1,
      "general intelligence": 1,
      "general awareness": 2,
      "gk": 2,
      "quantitative aptitude": 3,
      "english comprehension": 4,
      "english": 4
    };

    const cleanStr = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .replace(/Maths By Gagan Pratap Sir/gi, '')
        .replace(/Click To Join Telegram - Maths By Gagan Pratap Sir/gi, '')
        .replace(/Click To Join Telegram - /gi, '')
        .replace(/Telegram - /gi, '')
        .trim();
    };

    if (shift.questions && Array.isArray(shift.questions)) {
      shift.questions.forEach(q => {
        if (q.questionText) q.questionText = cleanStr(q.questionText);
        if (q.optionA) q.optionA = cleanStr(q.optionA);
        if (q.optionB) q.optionB = cleanStr(q.optionB);
        if (q.optionC) q.optionC = cleanStr(q.optionC);
        if (q.optionD) q.optionD = cleanStr(q.optionD);
      });

      shift.questions.sort((a, b) => {
        const orderA = subjectOrder[(a.subject || "").toLowerCase()] || 99;
        const orderB = subjectOrder[(b.subject || "").toLowerCase()] || 99;
        if (orderA !== orderB) return orderA - orderB;
        
        // Sort by orderIndex within the same subject
        const indexA = a.orderIndex !== undefined && a.orderIndex !== null ? a.orderIndex : 0;
        const indexB = b.orderIndex !== undefined && b.orderIndex !== null ? b.orderIndex : 0;
        return indexA - indexB;
      });
    }

    return res.status(200).json(shift);
  } catch (error) {
    console.error("Error fetching shift details:", error);
    return res.status(500).json({ error: "Failed to retrieve shift details." });
  }
};

module.exports = {
  getExams,
  getShiftDetails,
};