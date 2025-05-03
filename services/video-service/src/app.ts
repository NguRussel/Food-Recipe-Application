import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// Remove this import and config line
// import dotenv from 'dotenv';
// dotenv.config();
import videoRoutes from './routes/video.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/videos', videoRoutes);

// Database connection
const VIDEO_DB_URI = process.env.VIDEO_DB_URI;
if (!VIDEO_DB_URI) {
  console.error('VIDEO_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(VIDEO_DB_URI)
  .then(() => console.log('Connected to Video database'))
  .catch((err) => console.error('Database connection error:', err));

export default app;