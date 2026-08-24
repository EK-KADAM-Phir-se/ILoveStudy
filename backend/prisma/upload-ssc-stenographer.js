const prisma = require('../src/lib/prisma');
const fs = require('fs');
const path = require('path');

async function uploadFile(filename) {
  console.log(`📂 Reading question paper JSON file: ${filename}`);
  const jsonPath = path.join(__dirname, '..', 'src', 'papers', 'ssc-stenographer', filename);
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File not found at: ${jsonPath}`);
  }

  const paperData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const questionsList = paperData.questions;
  const examName = paperData.examName || 'SSC Stenographer';

  console.log(`Loaded ${questionsList.length} questions from JSON for exam "${examName}".`);

  // 1. Find or create the exam
  let exam = await prisma.exam.findFirst({
    where: { name: examName }
  });

  if (!exam) {
    console.log(`🌱 Creating "${examName}" exam in DB...`);
    exam = await prisma.exam.create({
      data: { name: examName }
    });
  }

  // Parse details from filename / JSON
  let year = paperData.year || 2025;
  let shiftName = paperData.shiftName || '6 Aug - Shift 1';
  let examDate = paperData.examDate ? new Date(paperData.examDate) : new Date('2025-08-06T09:00:00Z');

  console.log(`Parsed Shift Name: "${shiftName}", Exam Date: ${examDate.toISOString()}`);

  // 2. Find or create the Shift
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

  // 3. Insert questions
  console.log('🌱 Inserting questions...');
  const questionsToInsert = questionsList.map((q) => {
    return {
      shiftId: shift.id,
      subject: q.subject,
      questionText: q.questionText,
      imageUrl: q.imageUrl || null,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption || 'A',
      positiveMarks: q.positiveMarks || 1,
      negativeMarks: q.negativeMarks || -0.25,
      orderIndex: q.orderIndex !== undefined ? q.orderIndex : 0
    };
  });

  const result = await prisma.question.createMany({
    data: questionsToInsert
  });

  console.log(`✅ Seeding completed! Inserted ${result.count} questions into shift "${shiftName}".`);
}

async function main() {
  const dir = path.join(__dirname, '..', 'src', 'papers', 'ssc-stenographer');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  console.log(`Found ${files.length} SSC Stenographer papers to seed.`);
  
  for (let i = 0; i < files.length; i++) {
    console.log(`\n--- Seeding paper ${i+1}/${files.length} ---`);
    await uploadFile(files[i]);
  }
  
  console.log("\n🎉 All SSC Stenographer papers seeded successfully into the database!");
}

main()
  .catch((e) => {
    console.error('❌ Error uploading papers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
