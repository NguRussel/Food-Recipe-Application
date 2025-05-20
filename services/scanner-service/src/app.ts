import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import scanRoutes from './routes/scan.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '5mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Static files for temporary uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/scan', scanRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('Connected to Scanner Service database'))
.catch((err) => {
  console.error('Database connection error:', err.message);
  if (err.message.includes('IP whitelist')) {
    console.error('Please whitelist your IP address in MongoDB Atlas');
  }
});

// Error handling middleware
app.use(errorHandler);

export default app;