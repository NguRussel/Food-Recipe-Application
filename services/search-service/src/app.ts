import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import searchRoutes from './routes/search.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/search', searchRoutes);

// Database connection
const SEARCH_DB_URI = process.env.SEARCH_DB_URI;
if (!SEARCH_DB_URI) {
  console.error('SEARCH_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(SEARCH_DB_URI)
  .then(() => console.log('Connected to Search database'))
  .catch((err) => console.error('Database connection error:', err));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;