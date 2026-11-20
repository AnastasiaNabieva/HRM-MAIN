import { Router } from 'express';
import { getCandidatesQuerySchema, createCandidateSchema } from './candidates.schema';
import * as service from './candidates.service';
import { HttpError } from '../../middleware/errorHandler';
import { prisma } from '../../lib/prisma';

export const candidatesRouter = Router();

candidatesRouter.get('/', async (req, res, next) => {
  try {
    const query = getCandidatesQuerySchema.parse(req.query);
    const { data, total } = await service.getCandidates(query);
    
    res.json({
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

candidatesRouter.get('/:id', async (req, res, next) => {
  try {
    const candidate = await service.getCandidateById(req.params.id);
    if (!candidate) throw new HttpError(404, 'NOT_FOUND', 'Candidate not found');
    res.json({ data: candidate });
  } catch (err) {
    next(err);
  }
});

candidatesRouter.post('/', async (req, res, next) => {
  try {
    const body = createCandidateSchema.parse(req.body);
    
    const newCandidate = await prisma.candidate.create({
      data: {
        ...body,
        avatarUrl: `https://dummyjson.com/icon/${body.firstName}/128`,
        stageId: body.stageId || 'open',
        lat: 40.7128 + (Math.random() * 0.1),
        lng: -74.0060 + (Math.random() * 0.1),
      },
    });
    
    res.status(201).json({ data: newCandidate });
  } catch (err) {
    next(err);
  }
});

candidatesRouter.put('/:id', async (req, res, next) => {
  try {
    const body = createCandidateSchema.parse(req.body);
    
    const updated = await prisma.candidate.update({
      where: { id: req.params.id },
      data: body,
    });
    
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

candidatesRouter.post('/bulk-delete', async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new HttpError(400, 'BAD_REQUEST', 'No IDs provided');
    }

    await prisma.candidate.deleteMany({
      where: { id: { in: ids } },
    });

    res.json({ message: `${ids.length} candidates deleted successfully` });
  } catch (err) {
    next(err);
  }
});

candidatesRouter.delete('/:id', async (req, res, next) => {
  try {
    await service.deleteCandidate(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});