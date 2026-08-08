const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing data to prevent duplicate key errors during seeding
  await prisma.question.deleteMany({});
  await prisma.shift.deleteMany({});
  await prisma.exam.deleteMany({});

  // 2. Create an Exam
  const exam = await prisma.exam.create({
    data: {
      name: 'JEE Main',
    },
  });

  // 3. Create a Shift under that Exam
  const shift = await prisma.shift.create({
    data: {
      examId: exam.id,
      name: '2026 Jan Shift 1',
      date: new Date('2026-01-24T09:00:00Z'), // Sets a mock date for the exam shift
    },
  });

  // 4. Create sample Questions for this Shift
  await prisma.question.createMany({
    data: [
      {
        shiftId: shift.id,
        subject: 'Chemistry',
        questionText: 'What is the oxidation state of Nitrogen in HNO3?',
        optionA: '+3',
        optionB: '+5',
        optionC: '-3',
        optionD: '0',
        correctOption: 'B',
        positiveMarks: 4,
        negativeMarks: -1,
      },
      {
        shiftId: shift.id,
        subject: 'Physics',
        questionText: 'An object is placed at the focus of a concave mirror. Where is the image formed?',
        optionA: 'At focus',
        optionB: 'At center of curvature',
        optionC: 'At infinity',
        optionD: 'Between focus and pole',
        correctOption: 'C',
        positiveMarks: 4,
        negativeMarks: -1,
      }
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });