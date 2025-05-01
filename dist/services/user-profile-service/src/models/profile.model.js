"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true },
    preferences: {
        dietaryRestrictions: [String],
        allergies: [String],
        favoriteRecipes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Recipe' }]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.Profile = mongoose_1.default.model('Profile', profileSchema);
//# sourceMappingURL=profile.model.js.map