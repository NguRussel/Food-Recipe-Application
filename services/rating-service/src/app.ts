import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ratingRoutes from './routes/rating.routes';

dotenv.config();

const app: express.Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/ratings', ratingRoutes);

// MongoDB connection
const RATING_DB_URI = process.env.RATING_DB_URI;
if (!RATING_DB_URI) {
  console.error('RATING_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(RATING_DB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to Rating database'))
.catch((err) => console.error('Rating DB connection error:', err));

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong in Rating Service!' });
});

export default app;
