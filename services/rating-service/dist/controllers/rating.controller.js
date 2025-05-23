"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRating = exports.getUserRatings = exports.getAverageRatingByRecipe = exports.getRatingsByRecipe = exports.addRating = void 0;
const rating_model_1 = __importDefault(require("../models/rating.model"));
const addRating = async (req, res) => {
    var _a, _b;
    try {
        const { recipeId, stars, comment } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }
        // Check if user has already rated this recipe
        const existingRating = await rating_model_1.default.findOne({ userId, recipeId });
        if (existingRating) {
            // Update existing rating
            existingRating.stars = stars;
            if (comment !== undefined) {
                existingRating.comment = comment;
            }
            await existingRating.save();
            return res.status(200).json(existingRating);
        }
        // Create new rating
        const rating = new rating_model_1.default({
            userId,
            recipeId,
            stars,
            comment
        });
        await rating.save();
        res.status(201).json(rating);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addRating = addRating;
const getRatingsByRecipe = async (req, res) => {
    try {
        const ratings = await rating_model_1.default.find({ recipeId: req.params.recipeId });
        res.status(200).json(ratings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRatingsByRecipe = getRatingsByRecipe;
const getAverageRatingByRecipe = async (req, res) => {
    try {
        const result = await rating_model_1.default.aggregate([
            { $match: { recipeId: req.params.recipeId } },
            {
                $group: {
                    _id: "$recipeId",
                    averageRating: { $avg: "$stars" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);
        if (result.length === 0) {
            return res.status(200).json({ averageRating: 0, totalRatings: 0 });
        }
        res.status(200).json({
            averageRating: parseFloat(result[0].averageRating.toFixed(1)),
            totalRatings: result[0].totalRatings
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAverageRatingByRecipe = getAverageRatingByRecipe;
const getUserRatings = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }
        const ratings = await rating_model_1.default.find({ userId });
        res.status(200).json(ratings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserRatings = getUserRatings;
const deleteRating = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in token' });
        }
        // Find the rating and ensure it belongs to the user
        const rating = await rating_model_1.default.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        if (rating.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this rating' });
        }
        await rating_model_1.default.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteRating = deleteRating;
