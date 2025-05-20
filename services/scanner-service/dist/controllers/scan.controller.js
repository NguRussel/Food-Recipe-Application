"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanController = void 0;
const clarifai_service_1 = __importDefault(require("../services/clarifai.service"));
const recipeMatch_service_1 = __importDefault(require("../services/recipeMatch.service"));
const imageUtils_1 = __importDefault(require("../utils/imageUtils"));
const scanResults_model_1 = __importDefault(require("../models/scanResults.model"));
class ScanController {
    /**
     * Scan image uploaded as a file
     */
    async scanImageFile(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No image file provided' });
                return;
            }
            const imagePath = req.file.path;
            await this.processImage(req, res, imagePath, false);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'An error occurred during image scanning' });
        }
    }
    /**
     * Scan image provided as base64 data
     */
    async scanImageBase64(req, res) {
        try {
            const { imageData } = req.body;
            if (!imageData) {
                res.status(400).json({ error: 'No base64 image data provided' });
                return;
            }
            // Validate base64 format
            if (!imageData.startsWith('data:image/')) {
                res.status(400).json({ error: 'Invalid base64 image format' });
                return;
            }
            // Save base64 image to disk temporarily
            const imagePath = imageUtils_1.default.saveBase64Image(imageData);
            await this.processImage(req, res, imagePath, true);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'An error occurred during image scanning' });
        }
    }
    /**
     * Process the image, detect ingredients, and find matching recipes
     */
    async processImage(req, res, imagePath, isBase64) {
        try {
            // Analyze image with Clarifai
            const detectedIngredients = await clarifai_service_1.default.analyzeImage(imagePath, isBase64);
            if (detectedIngredients.length === 0) {
                // Clean up the image file
                imageUtils_1.default.deleteImage(imagePath);
                res.status(404).json({
                    error: 'No ingredients detected in the image',
                    message: 'Please try another image with clearer food items.'
                });
                return;
            }
            // Find matching recipes
            const matchedRecipes = await recipeMatch_service_1.default.findMatchingRecipes(detectedIngredients);
            // Save scan result to database
            const userId = req.user?.id || 'anonymous';
            const scanResult = new scanResults_model_1.default({
                userId,
                imageUrl: imagePath,
                detectedIngredients,
                matchedRecipes
            });
            await scanResult.save();
            // Clean up the image file
            imageUtils_1.default.deleteImage(imagePath);
            // Return the results
            res.status(200).json({
                success: true,
                data: {
                    scanId: scanResult._id,
                    detectedIngredients,
                    matchedRecipes
                }
            });
        }
        catch (error) {
            // Clean up the image file in case of error
            imageUtils_1.default.deleteImage(imagePath);
            throw error;
        }
    }
    /**
     * Get scan history for a user
     */
    async getScanHistory(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const scanHistory = await scanResults_model_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .select('-__v')
                .limit(10);
            res.status(200).json({
                success: true,
                data: scanHistory
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'An error occurred retrieving scan history' });
        }
    }
}
exports.ScanController = ScanController;
exports.default = new ScanController();
//# sourceMappingURL=scan.controller.js.map