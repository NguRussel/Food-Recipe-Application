import { Router } from 'express';
import { addRating, getRatingsByRecipe, deleteRating } from '../controllers/rating.controller';

const router: Router = Router();

router.post('/', addRating);
router.get('/recipe/:recipeId', getRatingsByRecipe);
router.delete('/:id', deleteRating);

export default router;
