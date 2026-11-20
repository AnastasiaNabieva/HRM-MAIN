import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

export const boardRouter = Router();

const updateStageSchema = z.object({
  stageId: z.string().nullable(),
  positionInStage: z.number().int().min(0).default(0),
});

boardRouter.get('/', async (req, res, next) => {
  try {
    const stages = await prisma.stage.findMany({
      orderBy: { order: 'asc' },
      include: {
        candidates: {
          orderBy: { positionInStage: 'asc' },
        },
      },
    });
    res.json({ data: { stages } });
  } catch (err) {
    next(err);
  }
});

boardRouter.patch('/candidates/:id/stage', async (req, res, next) => {
  try {
    const body = updateStageSchema.parse(req.body);
    
    const updated = await prisma.candidate.update({
      where: { id: req.params.id },
      data: {
        stageId: body.stageId,
        positionInStage: body.positionInStage,
      },
    });
    
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});