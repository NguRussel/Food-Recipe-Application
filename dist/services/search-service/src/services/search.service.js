"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const search_model_1 = __importDefault(require("../models/search.model"));
class SearchService {
    async searchRecipes(query, filters) {
        const searchQuery = {};
        if (query) {
            searchQuery.$text = { $search: query };
        }
        if (filters) {
            if (filters.culture)
                searchQuery.culture = filters.culture;
            if (filters.category)
                searchQuery.category = { $in: filters.category };
            if (filters.difficulty)
                searchQuery.difficulty = filters.difficulty;
            if (filters.maxPrepTime)
                searchQuery.preparationTime = { $lte: filters.maxPrepTime };
            if (filters.maxCookTime)
                searchQuery.cookingTime = { $lte: filters.maxCookTime };
            if (filters.ingredients)
                searchQuery.ingredients = { $all: filters.ingredients };
        }
        return search_model_1.default.find(searchQuery)
            .sort({ searchScore: -1 })
            .limit(20);
    }
    async indexRecipe(recipeData) {
        const searchDoc = new search_model_1.default({
            ...recipeData,
            tags: this.generateTags(recipeData)
        });
        return searchDoc.save();
    }
    async updateRecipeIndex(recipeId, recipeData) {
        return search_model_1.default.findOneAndUpdate({ recipeId }, {
            ...recipeData,
            tags: this.generateTags(recipeData)
        }, { new: true });
    }
    async deleteRecipeIndex(recipeId) {
        const result = await search_model_1.default.deleteOne({ recipeId });
        return result.deletedCount > 0;
    }
    generateTags(recipeData) {
        const tags = new Set();
        // Add normalized title words
        recipeData.title.toLowerCase().split(' ').forEach((word) => tags.add(word));
        // Add culture
        tags.add(recipeData.culture.toLowerCase());
        // Add categories
        recipeData.category.forEach((cat) => tags.add(cat.toLowerCase()));
        // Add ingredients
        recipeData.ingredients.forEach((ing) => tags.add(ing.toLowerCase()));
        return Array.from(tags);
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map