"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/profiles', profile_routes_1.default);
// Database connection
const USER_PROFILE_DB_URI = process.env.USER_PROFILE_DB_URI;
if (!USER_PROFILE_DB_URI) {
    console.error('USER_PROFILE_DB_URI is not defined in environment variables');
    process.exit(1);
}
mongoose_1.default.connect(USER_PROFILE_DB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('Connected to User Profile database'))
    .catch((err) => console.error('Database connection error:', err));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
exports.default = app;
//# sourceMappingURL=app.js.map