const prisma = require('../src/lib/prisma');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('📂 Reading question paper JSON file...');
  const jsonPath = path.join(__dirname, '..', 'src', 'papers', 'JEE Main 2025 (23 Jan Shift 1).json');
  
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

  // 2. Find or create the Shift: "23 Jan - Shift 1"
  const shiftName = '23 Jan - Shift 1';
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
        date: new Date('2025-01-23T09:00:00Z') // Set exam date to 23 Jan 2025
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
