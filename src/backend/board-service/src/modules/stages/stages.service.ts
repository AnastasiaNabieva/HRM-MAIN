import { prisma } from '../../lib/prisma';

export async function getStages() {
  return prisma.stage.findMany({ orderBy: { order: 'asc' } });
}