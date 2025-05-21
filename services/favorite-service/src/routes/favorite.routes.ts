import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const favoriteController = new FavoriteController();

// All routes require authentication
router.use(authenticate);

// Add a recipe to favorites
router.post('/', favoriteController.addFavorite);

// Remove a recipe from favorites
router.delete('/:recipeId', favoriteController.removeFavorite);

// Get all favorites for the authenticated user
router.get('/', favoriteController.getUserFavorites);

// Check if a recipe is favorited by the user
router.get('/check/:recipeId', favoriteController.checkFavorite);

export default router;