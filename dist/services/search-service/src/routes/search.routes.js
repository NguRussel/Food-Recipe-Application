"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const auth_1 = require("../middleware/auth");
const search_validation_1 = require("../middleware/search.validation");
const rate_limit_1 = require("../middleware/rate-limit");
const router = (0, express_1.Router)();
const searchController = new search_controller_1.SearchController();
// Apply rate limiting to all search routes
router.use((0, rate_limit_1.rateLimit)(60)); // 60 requests per minute
router.get('/', search_validation_1.validateSearchQuery, searchController.searchRecipes.bind(searchController));
router.post('/index', auth_1.authenticate, search_validation_1.validateRecipeIndex, searchController.indexRecipe.bind(searchController));
router.put('/index/:recipeId', auth_1.authenticate, search_validation_1.validateRecipeIndex, searchController.updateRecipeIndex.bind(searchController));
router.delete('/index/:recipeId', auth_1.authenticate, searchController.deleteRecipeIndex.bind(searchController));
exports.default = router;
//# sourceMappingURL=search.routes.js.map