const prisma = require('../src/lib/prisma');
const fs = require('fs');
const path = require('path');

async function main() {
  const filename = process.argv[2] || 'JEE Main 2025 (23 Jan Shift 1).json';
  console.log(`📂 Reading question paper JSON file: ${filename}`);
  const jsonPath = path.join(__dirname, '..', 'src', 'papers', filename);
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File not found at: ${jsonPath}`);
  }

  const paperData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const questionsList = paperData.questions;

  console.log(`Loaded ${questionsList.length} questions from JSON.`);

  // 1. Find or create the "JEE Main" exam
  console.log('🔍 Checking for "JEE Main" exam...');
  let exam = await prisma.exam.findFirst({
    where: { name: 'JEE Main' }
  });

  if (!exam) {
    console.log('🌱 Creating "JEE Main" exam in DB...');
    exam = await prisma.exam.create({
      data: { name: 'JEE Main' }
    });
  }
  console.log(`Exam ID: ${exam.id}`);

  // Parse filename to extract year, shiftName, and date
  let year = 2025;
  let shiftName = '23 Jan - Shift 1';
  let examDate = new Date('2025-01-23T09:00:00Z');

  const match = filename.match(/(\d{4})\s*\((.*?)\)/);
  if (match) {
    year = parseInt(match[1], 10);
    const details = match[2]; // e.g. "22 Jan Shift 1"
    if (details.includes('Shift') && !details.includes('-')) {
      shiftName = details.replace(/Shift/i, '- Shift');
    } else {
      shiftName = details;
    }

    const dayMonthMatch = details.match(/(\d+)\s*([a-zA-Z]+)/);
    if (dayMonthMatch) {
      const day = parseInt(dayMonthMatch[1], 10);
      const monthStr = dayMonthMatch[2].toLowerCase();
      const monthMap = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
      };
      const month = monthMap[monthStr.substring(0, 3)] || '01';
      examDate = new Date(`${year}-${month}-${String(day).padStart(2, '0')}T09:00:00Z`);
    }
  }

  console.log(`Parsed Shift Name: "${shiftName}", Exam Date: ${examDate.toISOString()}`);

  // 2. Find or create the Shift
  console.log(`🔍 Checking for shift "${shiftName}"...`);
  let shift = await prisma.shift.findFirst({
    where: {
      examId: exam.id,
      name: shiftName
    }
  });

  if (shift) {
    console.log(`🗑️ Shift already exists. Clearing existing questions for shift "${shiftName}"...`);
    await prisma.question.deleteMany({
      where: { shiftId: shift.id }
    });
  } else {
    console.log(`🌱 Creating shift "${shiftName}"...`);
    shift = await prisma.shift.create({
      data: {
        examId: exam.id,
        name: shiftName,
        date: examDate
      }
    });
  }
  console.log(`Shift ID: ${shift.id}`);

  // 3. Insert questions
  console.log('🌱 Inserting questions...');
  const questionsToInsert = questionsList.map((q) => {
    // Map "Mathematics" to "Math" to match the database subject schema comment
    const mappedSubject = q.subject === 'Mathematics' ? 'Math' : q.subject;

    return {
      shiftId: shift.id,
      subject: mappedSubject,
      questionText: q.questionText,
      imageUrl: q.imageUrl || null,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption || 'A', // Fallback to 'A' as correctOption is required by schema but null in JSON
      positiveMarks: q.positiveMarks ?? 4,
      negativeMarks: q.negativeMarks ?? -1
    };
  });

  const result = await prisma.question.createMany({
    data: questionsToInsert
  });

  console.log(`✅ Seeding completed! Inserted ${result.count} questions into shift "${shiftName}".`);
}

main()
  .catch((e) => {
    console.error('❌ Error uploading paper:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
