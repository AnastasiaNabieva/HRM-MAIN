import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { candidatesRouter } from './modules/candidates/candidates.router';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/candidates', candidatesRouter);

app.use(errorHandler);

app.listen(4000, () => {
  console.log('Core Service is running on http://localhost:4000');
});