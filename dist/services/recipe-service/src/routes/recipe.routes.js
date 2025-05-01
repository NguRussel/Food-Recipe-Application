"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipe_controller_1 = require("../controllers/recipe.controller");
const recipe_validation_1 = require("../middleware/recipe.validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const recipeController = new recipe_controller_1.RecipeController();
router.post('/', auth_1.authenticate, recipe_validation_1.validateRecipe, recipeController.createRecipe);
router.get('/:id', recipeController.getRecipe);
router.put('/:id', auth_1.authenticate, recipe_validation_1.validateRecipe, recipeController.updateRecipe);
router.delete('/:id', auth_1.authenticate, recipeController.deleteRecipe);
router.get('/category/:category', recipeController.getRecipesByCategory);
router.get('/culture/:culture', recipeController.getRecipesByCulture);
exports.default = router;
//# sourceMappingURL=recipe.routes.js.map