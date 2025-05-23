"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rating_controller_1 = require("../controllers/rating.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Public routes
router.get('/recipe/:recipeId', rating_controller_1.getRatingsByRecipe);
router.get('/recipe/:recipeId/average', rating_controller_1.getAverageRatingByRecipe);
// Protected routes
router.post('/', auth_1.authenticate, validation_1.validateRating, rating_controller_1.addRating);
router.get('/user', auth_1.authenticate, rating_controller_1.getUserRatings);
router.delete('/:id', auth_1.authenticate, rating_controller_1.deleteRating);
exports.default = router;
