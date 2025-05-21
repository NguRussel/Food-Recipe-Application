"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const recipe_model_1 = __importDefault(require("../models/recipe.model"));
class RecipeController {
    async createRecipe(req, res) {
        try {
            const recipe = new recipe_model_1.default(req.body);
            const savedRecipe = await recipe.save();
            res.status(201).json(savedRecipe);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getRecipe(req, res) {
        try {
            const recipe = await recipe_model_1.default.findById(req.params.id);
            if (!recipe) {
                res.status(404).json({ error: 'Recipe not found' });
                return;
            }
            res.status(200).json(recipe);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async updateRecipe(req, res) {
        try {
            const recipe = await recipe_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!recipe) {
                res.status(404).json({ error: 'Recipe not found' });
                return;
            }
            res.status(200).json(recipe);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async deleteRecipe(req, res) {
        try {
            const recipe = await recipe_model_1.default.findByIdAndDelete(req.params.id);
            if (!recipe) {
                res.status(404).json({ error: 'Recipe not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getRecipesByCategory(req, res) {
        try {
            const recipes = await recipe_model_1.default.find({ category: req.params.category });
            res.status(200).json(recipes);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getRecipesByCulture(req, res) {
        try {
            const recipes = await recipe_model_1.default.find({ culture: req.params.culture });
            res.status(200).json(recipes);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
}
exports.RecipeController = RecipeController;
//# sourceMappingURL=recipe.controller.js.map