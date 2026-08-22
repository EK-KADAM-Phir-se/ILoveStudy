const fs = require('fs');
const path = require('path');
const prisma = require('../../lib/prisma');

async function seed() {
  const jsonPath = path.join(__dirname, 'GATE 2024 Computer Science and Information Technology 1 (CS1).json');
  const paperData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  let gateExam = await prisma.exam.findFirst({
    where: { name: { contains: 'GATE', mode: 'insensitive' } }
  });
  if (!gateExam) {
    gateExam = await prisma.exam.create({ data: { name: 'GATE' } });
  }

  let shift = await prisma.shift.findFirst({
    where: {
      examId: gateExam.id,
      name: paperData.shiftName
    }
  });

  if (!shift) {
    shift = await prisma.shift.create({
      data: {
        examId: gateExam.id,
        name: paperData.shiftName,
        date: new Date(paperData.examDate)
      }
    });
  }

  await prisma.question.deleteMany({ where: { shiftId: shift.id } });

  const questionsToInsert = paperData.questions.map((q, idx) => ({
    shiftId: shift.id,
    subject: q.subject,
    questionText: q.questionText,
    imageUrl: q.imageUrl || null,
    optionA: q.optionA || '',
    optionB: q.optionB || '',
    optionC: q.optionC || '',
    optionD: q.optionD || '',
    correctOption: q.correctOption,
    positiveMarks: q.positiveMarks,
    negativeMarks: q.negativeMarks,
    orderIndex: idx + 1
  }));

  await prisma.question.createMany({ data: questionsToInsert });
  console.log(`✅ Seeded ${questionsToInsert.length} questions for ${shift.name}`);
}
seed().catch(console.error).finally(() => prisma.$disconnect());
