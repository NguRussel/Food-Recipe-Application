import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { authenticate } from '../middleware/auth';
import { validateSearchQuery, validateRecipeIndex } from '../middleware/search.validation';
import { rateLimit } from '../middleware/rate-limit';

const router = Router();
const searchController = new SearchController();

// Apply rate limiting to all search routes
router.use(rateLimit(60)); // 60 requests per minute

router.get('/', validateSearchQuery, searchController.searchRecipes.bind(searchController));
router.post('/index', authenticate, validateRecipeIndex, searchController.indexRecipe.bind(searchController));
router.put('/index/:recipeId', authenticate, validateRecipeIndex, searchController.updateRecipeIndex.bind(searchController));
router.delete('/index/:recipeId', authenticate, searchController.deleteRecipeIndex.bind(searchController));

export default router;