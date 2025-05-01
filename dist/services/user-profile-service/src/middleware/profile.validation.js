"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfile = void 0;
const joi_1 = __importDefault(require("joi"));
const profileSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().optional(),
    dietaryPreferences: joi_1.default.array().items(joi_1.default.string()),
    allergies: joi_1.default.array().items(joi_1.default.string()),
    cookingSkillLevel: joi_1.default.string().valid('beginner', 'intermediate', 'advanced'),
    preferredCuisines: joi_1.default.array().items(joi_1.default.string()),
    favoriteRecipes: joi_1.default.array().items(joi_1.default.string())
});
const validateProfile = async (req, res, next) => {
    try {
        await profileSchema.validateAsync(req.body);
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
exports.validateProfile = validateProfile;
//# sourceMappingURL=profile.validation.js.map