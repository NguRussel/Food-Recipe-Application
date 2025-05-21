"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("../services/search.service");
class SearchController {
    constructor() {
        this.searchService = new search_service_1.SearchService();
    }
    async searchRecipes(req, res) {
        try {
            const { query, ...filters } = req.query;
            const results = await this.searchService.searchRecipes(query, filters);
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json({ error: 'Search operation failed' });
        }
    }
    async indexRecipe(req, res) {
        try {
            const indexed = await this.searchService.indexRecipe(req.body);
            res.status(201).json(indexed);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to index recipe' });
        }
    }
    async updateRecipeIndex(req, res) {
        try {
            const updated = await this.searchService.updateRecipeIndex(req.params.recipeId, req.body);
            if (!updated) {
                res.status(404).json({ error: 'Recipe not found in index' });
                return;
            }
            res.status(200).json(updated);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to update recipe index' });
        }
    }
    async deleteRecipeIndex(req, res) {
        try {
            const deleted = await this.searchService.deleteRecipeIndex(req.params.recipeId);
            if (!deleted) {
                res.status(404).json({ error: 'Recipe not found in index' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete recipe index' });
        }
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map