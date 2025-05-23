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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MongoDB connection
const RATING_DB_URI = process.env.RATING_DB_URI || 'mongodb://localhost:27017/cameroon-food-recipe';

mongoose.connect(RATING_DB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to Rating database'))
.catch((err) => console.error('Rating DB connection error:', err));

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong in Rating Service!' });
});

export default app;