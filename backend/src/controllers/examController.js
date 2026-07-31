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