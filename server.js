import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './src/routes/authRoutes.js';
import recipeRoutes from './src/routes/recipeRoutes.js';
import dbConnect from './src/config/dbConnect.js';



//Database connection


dotenv.config();
dbConnect();
const app = express();

//middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
  app.use(cors(corsOptions));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    },
}));
app.use(passport.initialize());
app.use(passport.session());


//Routes

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Cameroonian Food Recipe API!');
  });

//Listening to the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
