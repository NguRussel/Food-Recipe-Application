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
const video_routes_1 = __importDefault(require("./routes/video.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/videos', video_routes_1.default);
// Database connection
const VIDEO_DB_URI = process.env.VIDEO_DB_URI;
if (!VIDEO_DB_URI) {
    console.error('VIDEO_DB_URI is not defined in environment variables');
    process.exit(1);
}
mongoose_1.default.connect(VIDEO_DB_URI)
    .then(() => console.log('Connected to Video database'))
    .catch((err) => console.error('Database connection error:', err));
exports.default = app;
//# sourceMappingURL=app.js.map