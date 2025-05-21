import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import allergyRoutes from './routes/allergy.routes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/allergies', allergyRoutes);

// MongoDB connection
const ALLERGY_DB_URI = process.env.ALLERGY_DB_URI;
if (!ALLERGY_DB_URI) {
  console.error('ALLERGY_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(ALLERGY_DB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to Allergy database'))
.catch((err) => console.error('Allergy DB connection error:', err));

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong in Allergy Service!' });
});

export default app;
