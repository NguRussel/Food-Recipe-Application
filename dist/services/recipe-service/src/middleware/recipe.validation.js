"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecipe = void 0;
const joi_1 = __importDefault(require("joi"));
const recipeSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    ingredients: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        quantity: joi_1.default.number().required(),
        unit: joi_1.default.string().required()
    })).required(),
    instructions: joi_1.default.array().items(joi_1.default.string()).required(),
    preparationTime: joi_1.default.number().required(),
    cookingTime: joi_1.default.number().required(),
    servings: joi_1.default.number().required(),
    difficulty: joi_1.default.string().valid('easy', 'medium', 'hard').required(),
    culture: joi_1.default.string().required(),
    category: joi_1.default.array().items(joi_1.default.string()).required(),
    authorId: joi_1.default.string().required(),
    images: joi_1.default.array().items(joi_1.default.string()),
    videoUrl: joi_1.default.string().uri().optional()
});
const validateRecipe = async (req, res, next) => {
    try {
        await recipeSchema.validateAsync(req.body);
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
exports.validateRecipe = validateRecipe;
//# sourceMappingURL=recipe.validation.js.map