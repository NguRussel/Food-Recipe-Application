"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const profile_validation_1 = require("../middleware/profile.validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const profileController = new profile_controller_1.ProfileController();
router.post('/', auth_1.authenticate, profile_validation_1.validateProfile, profileController.createProfile);
router.get('/:userId', auth_1.authenticate, profileController.getProfile);
router.put('/:userId', auth_1.authenticate, profile_validation_1.validateProfile, profileController.updateProfile);
router.patch('/:userId/preferences', auth_1.authenticate, profileController.updatePreferences);
router.post('/:userId/favorites/:recipeId', auth_1.authenticate, profileController.addFavoriteRecipe);
router.delete('/:userId/favorites/:recipeId', auth_1.authenticate, profileController.removeFavoriteRecipe);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map