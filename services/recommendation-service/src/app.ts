import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import recommendationRoutes from './routes/recommendation.routes';
import feedbackRoutes from './routes/feedback.routes';
import { monitoringMiddleware } from './utils/monitoring';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(monitoringMiddleware);
app.use(limiter);

// Routes
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/feedback', feedbackRoutes);

// Database connection
const RECOMMENDATION_DB_URI = process.env.RECOMMENDATION_DB_URI;
if (!RECOMMENDATION_DB_URI) {
  console.error('RECOMMENDATION_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(RECOMMENDATION_DB_URI)
  .then(() => console.log('Connected to Recommendation database'))
  .catch((err) => console.error('Database connection error:', err));

export default app;