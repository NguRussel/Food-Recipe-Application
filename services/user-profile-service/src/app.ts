import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/profiles', profileRoutes);

// Database connection
const USER_PROFILE_DB_URI = process.env.USER_PROFILE_DB_URI;
if (!USER_PROFILE_DB_URI) {
  console.error('USER_PROFILE_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(USER_PROFILE_DB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to User Profile database'))
.catch((err) => console.error('Database connection error:', err));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;