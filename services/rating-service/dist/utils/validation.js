"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRating = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
const validateRating = (req, res, next) => {
    const { userId, recipeId, stars } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!recipeId) {
        return res.status(400).json({ error: 'Recipe ID is required' });
    }
    if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'Stars must be a number between 1 and 5' });
    }
    next();
};
exports.validateRating = validateRating;
