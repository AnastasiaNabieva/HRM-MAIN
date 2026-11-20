import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function getCandidates(params: { page: number; limit: number; search?: string; stageId?: string }) {
  const { page, limit, search, stageId } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.CandidateWhereInput = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { position: { contains: search } },
    ];
  }
  if (stageId) {
    where.stageId = stageId;
  }

  const [data, total] = await Promise.all([
    prisma.candidate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { stage: true },
    }),
    prisma.candidate.count({ where }),
  ]);

  return { data, total };
}

export async function getCandidateById(id: string) {
  return prisma.candidate.findUnique({
    where: { id },
    include: { stage: true, activities: { orderBy: { createdAt: 'desc' } } },
  });
}

export async function createCandidate(data: Prisma.CandidateUncheckedCreateInput) {
  return prisma.candidate.create({ data });
}

export async function deleteCandidate(id: string) {
  return prisma.candidate.delete({ where: { id } });
}