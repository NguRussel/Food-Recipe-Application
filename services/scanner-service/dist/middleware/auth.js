"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map