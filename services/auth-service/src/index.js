import express, { json, urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import "./config/passportConfig.js"; // Assuming you have a passport configuration file

dotenv.config();
dbConnect(); // Connect to the database


const app = express();

//middleware
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(json({limit: '100mb'}));
app.use(urlencoded({ limit: "100mb", extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60, // 1HR
        secure: process.env.NODE_ENV === 'production', // Set to true if using https
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
}));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/api/auth', authRoutes);

//listening app

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});