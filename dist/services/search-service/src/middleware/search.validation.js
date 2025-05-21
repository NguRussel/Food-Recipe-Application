"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecipeIndex = exports.validateSearchQuery = void 0;
const joi_1 = __importDefault(require("joi"));
const searchQuerySchema = joi_1.default.object({
    query: joi_1.default.string().allow('').optional(),
    culture: joi_1.default.string().optional(),
    category: joi_1.default.array().items(joi_1.default.string()).optional(),
    difficulty: joi_1.default.string().valid('easy', 'medium', 'hard').optional(),
    maxPrepTime: joi_1.default.number().min(0).optional(),
    maxCookTime: joi_1.default.number().min(0).optional(),
    ingredients: joi_1.default.array().items(joi_1.default.string()).optional(),
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).max(50).optional()
});
const recipeIndexSchema = joi_1.default.object({
    recipeId: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    ingredients: joi_1.default.array().items(joi_1.default.string()).required(),
    culture: joi_1.default.string().required(),
    category: joi_1.default.array().items(joi_1.default.string()).required(),
    difficulty: joi_1.default.string().valid('easy', 'medium', 'hard').required(),
    preparationTime: joi_1.default.number().min(0).required(),
    cookingTime: joi_1.default.number().min(0).required(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional()
});
const validateSearchQuery = async (req, res, next) => {
    try {
        await searchQuerySchema.validateAsync(req.query);
        next();
    }
    catch (error) {
        if (error instanceof joi_1.default.ValidationError) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateSearchQuery = validateSearchQuery;
const validateRecipeIndex = async (req, res, next) => {
    try {
        await recipeIndexSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof joi_1.default.ValidationError) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateRecipeIndex = validateRecipeIndex;
//# sourceMappingURL=search.validation.js.map