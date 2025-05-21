"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const user_profile_model_1 = __importDefault(require("../models/user-profile.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class ProfileController {
    async createProfile(req, res) {
        try {
            const userId = req.user?.sub;
            if (!userId) {
                res.status(401).json({ error: 'User ID not found in token' });
                return;
            }
            const existingProfile = await user_profile_model_1.default.findOne({ userId });
            if (existingProfile) {
                res.status(409).json({ error: 'Profile already exists for this user' });
                return;
            }
            const profile = new user_profile_model_1.default({
                ...req.body,
                userId
            });
            const savedProfile = await profile.save();
            res.status(201).json(savedProfile);
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getProfile(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const profile = await user_profile_model_1.default.findOne({ userId });
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updateProfile(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const profile = await user_profile_model_1.default.findOneAndUpdate({ userId }, req.body, { new: true, runValidators: true });
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updatePreferences(req, res) {
        try {
            const { userId } = req.params;
            const { dietaryPreferences, allergies, preferredCuisines } = req.body;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            if (!dietaryPreferences && !allergies && !preferredCuisines) {
                res.status(400).json({ error: 'No preferences provided for update' });
                return;
            }
            const updateData = {};
            if (dietaryPreferences)
                updateData.dietaryPreferences = dietaryPreferences;
            if (allergies)
                updateData.allergies = allergies;
            if (preferredCuisines)
                updateData.preferredCuisines = preferredCuisines;
            const profile = await user_profile_model_1.default.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async addFavoriteRecipe(req, res) {
        try {
            const { userId, recipeId } = req.params;
            if (!userId || !recipeId) {
                res.status(400).json({ error: 'User ID and Recipe ID are required' });
                return;
            }
            const profile = await user_profile_model_1.default.findOneAndUpdate({ userId }, { $addToSet: { favoriteRecipes: recipeId } }, { new: true });
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async removeFavoriteRecipe(req, res) {
        try {
            const { userId, recipeId } = req.params;
            if (!userId || !recipeId) {
                res.status(400).json({ error: 'User ID and Recipe ID are required' });
                return;
            }
            const profile = await user_profile_model_1.default.findOneAndUpdate({ userId }, { $pull: { favoriteRecipes: recipeId } }, { new: true });
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map