import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { config } from './config/config';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database connection
const AUTH_DB_URI = process.env.AUTH_DB_URI;
if (!AUTH_DB_URI) {
  console.error('AUTH_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(AUTH_DB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to Auth database'))
.catch((err) => console.error('Database connection error:', err));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

export default app;