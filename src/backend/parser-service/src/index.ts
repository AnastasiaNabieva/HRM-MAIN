import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { uploadRouter } from './modules/upload/upload.router';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRouter);

app.use(errorHandler);

app.listen(4002, () => {
  console.log('Parser Service is running on http://localhost:4002');
});