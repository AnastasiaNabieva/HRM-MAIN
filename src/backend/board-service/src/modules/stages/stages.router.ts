import { Router } from 'express';
import * as service from './stages.service';

export const stagesRouter = Router();

stagesRouter.get('/', async (req, res, next) => {
  try {
    const stages = await service.getStages();
    res.json({ data: stages });
  } catch (err) {
    next(err);
  }
});