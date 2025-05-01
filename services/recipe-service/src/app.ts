import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipe.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/recipes', recipeRoutes);

// Database connection
const RECIPE_DB_URI = process.env.RECIPE_DB_URI;
if (!RECIPE_DB_URI) {
  console.error('RECIPE_DB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(RECIPE_DB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('Connected to Recipe database'))
.catch((err) => {
  console.error('Database connection error:', err.message);
  if (err.message.includes('IP whitelist')) {
    console.error('Please whitelist your IP address in MongoDB Atlas');
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;