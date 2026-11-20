import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { stagesRouter } from './modules/stages/stages.router';
import { boardRouter } from './modules/board/board.router';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/stages', stagesRouter);
app.use('/api/board', boardRouter);

app.use(errorHandler);

app.listen(4001, () => {
  console.log('Board Service is running on http://localhost:4001');
});