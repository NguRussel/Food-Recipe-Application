"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route'
            });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if user exists
        const user = await user_model_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized to access this route'
        });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.middleware.js.map