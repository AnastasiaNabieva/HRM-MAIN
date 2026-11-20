import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.stage.deleteMany();

  const stagesData = [
    { id: 'open', title: 'Open deal', order: 1, color: '#3b82f6' },
    { id: 'progress', title: 'In progress', order: 2, color: '#eab308' },
    { id: 'contract', title: 'Contract', order: 3, color: '#f97316' },
    { id: 'won', title: 'Won', order: 4, color: '#22c55e' },
    { id: 'lost', title: 'Lost', order: 5, color: '#ef4444' },
  ];

  const stages = [];
  for (const stage of stagesData) {
    stages.push(await prisma.stage.create({ data: stage }));
  }

  const names = [
    ['John', 'Doe'], ['Jane', 'Smith'], ['Michael', 'Johnson'], ['Emily', 'Davis'],
    ['Chris', 'Brown'], ['Sarah', 'Wilson'], ['David', 'Taylor'], ['Emma', 'Thomas'],
    ['Daniel', 'Moore'], ['Olivia', 'Martin'], ['James', 'Jackson'], ['Sophia', 'White'],
    ['William', 'Harris'], ['Ava', 'Clark'], ['Alexander', 'Lewis'], ['Mia', 'Robinson'],
  ];

  for (let i = 0; i < names.length; i++) {
    const stage = stages[i % stages.length];
    await prisma.candidate.create({
      data: {
        firstName: names[i][0],
        lastName: names[i][1],
        email: `${names[i][0].toLowerCase()}.${names[i][1].toLowerCase()}${i}@example.com`,
        phone: `+1 (555) 01${10 + i}`,
        position: 'Frontend Developer',
        location: 'New York, USA',
        lat: 40.7128 + (Math.random() * 0.1),
        lng: -74.0060 + (Math.random() * 0.1),
        salary: 60000 + i * 5000,
        stageId: stage.id,
        positionInStage: Math.floor(i / stages.length),
        university: "NYU",
        gender: i % 2 === 0 ? "male" : "female",
        birthDate: "1990-01-01"
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });