import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import plannerRoutes from './routes/planner.routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/planner', plannerRoutes);

app.use(errorHandler);

export default app;