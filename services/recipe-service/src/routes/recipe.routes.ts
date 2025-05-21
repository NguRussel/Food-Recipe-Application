import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { validateRecipe } from '../middleware/recipe.validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const recipeController = new RecipeController();

router.post('/', authenticate, validateRecipe, recipeController.createRecipe);
router.get('/:id', recipeController.getRecipe);
router.put('/:id', authenticate, validateRecipe, recipeController.updateRecipe);
router.delete('/:id', authenticate, recipeController.deleteRecipe);
router.get('/category/:category', recipeController.getRecipesByCategory);
router.get('/culture/:culture', recipeController.getRecipesByCulture);

export default router;