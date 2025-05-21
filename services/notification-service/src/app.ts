import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/notifications', notificationRoutes);

// Database connection
const NOTIFICATION_DB_URI = process.env.NOTIFICATION_DB_URI;
if (!NOTIFICATION_DB_URI) {
  console.error('NOTIFICATION_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(NOTIFICATION_DB_URI)
  .then(() => console.log('Connected to Notification database'))
  .catch((err) => console.error('Database connection error:', err));

export default app;