"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVideo = void 0;
const joi_1 = __importDefault(require("joi"));
const videoSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    recipeId: joi_1.default.string().required(),
    thumbnailUrl: joi_1.default.string().uri().required(),
    duration: joi_1.default.number().required(),
    quality: joi_1.default.string().required()
});
const validateVideo = async (req, res, next) => {
    try {
        await videoSchema.validateAsync(req.body);
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
exports.validateVideo = validateVideo;
//# sourceMappingURL=video.validation.js.map