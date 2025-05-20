"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeMatchService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class RecipeMatchService {
    constructor() {
        this.recipeServiceUrl = process.env.RECIPE_SERVICE_URL || 'http://localhost:3002/api/recipes';
    }
    /**
     * Find recipes that match the detected ingredients
     * @param ingredients List of detected ingredients
     */
    async findMatchingRecipes(ingredients) {
        try {
            // Get all recipes from the recipe service
            const response = await axios_1.default.get(`${this.recipeServiceUrl}`);
            const recipes = response.data;
            if (!recipes || !Array.isArray(recipes)) {
                throw new Error('Invalid response from recipe service');
            }
            // Extract ingredient names for easier matching
            const detectedIngredientNames = ingredients.map(ing => ing.name.toLowerCase());
            // Match recipes with detected ingredients
            const matchedRecipes = [];
            recipes.forEach(recipe => {
                const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
                const matchedIngredients = [];
                // Find matching ingredients
                recipeIngredients.forEach(recipeIng => {
                    detectedIngredientNames.forEach(detectedIng => {
                        // Check if detected ingredient is part of recipe ingredient or vice versa
                        if (recipeIng.includes(detectedIng) || detectedIng.includes(recipeIng)) {
                            if (!matchedIngredients.includes(recipeIng)) {
                                matchedIngredients.push(recipeIng);
                            }
                        }
                    });
                });
                // Calculate match score (percentage of recipe ingredients matched)
                const matchScore = (matchedIngredients.length / recipeIngredients.length) * 100;
                // Only include recipes with at least one matching ingredient
                if (matchedIngredients.length > 0) {
                    matchedRecipes.push({
                        recipeId: recipe._id,
                        title: recipe.title,
                        matchScore,
                        matchedIngredients
                    });
                }
            });
            // Sort by match score (highest first)
            return matchedRecipes.sort((a, b) => b.matchScore - a.matchScore);
        }
        catch (error) {
            console.error('Error finding matching recipes:', error);
            return [];
        }
    }
}
exports.RecipeMatchService = RecipeMatchService;
exports.default = new RecipeMatchService();
//# sourceMappingURL=recipeMatch.service.js.map