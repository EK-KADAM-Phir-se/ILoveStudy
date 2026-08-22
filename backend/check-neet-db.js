const prisma = require('./src/lib/prisma');

async function main() {
  const shifts = await prisma.shift.findMany({
    where: { exam: { name: 'NEET' } },
    include: { questions: { where: { imageUrl: { not: null } }, take: 3 } }
  });
  console.log("NEET Shifts in DB:");
  shifts.forEach(s => {
    console.log(`- ${s.name} (ID: ${s.id})`);
    s.questions.forEach(q => {
      console.log(`  * Q: "${q.questionText.slice(0, 30)}..." | imageUrl: "${q.imageUrl}"`);
    });
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
