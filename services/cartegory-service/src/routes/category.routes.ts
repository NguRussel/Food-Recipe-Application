import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { validateCategory } from '../middleware/category.validation';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
const categoryController = new CategoryController();

// Admin routes (protected)
router.post('/', authenticate, isAdmin, validateCategory, categoryController.createCategory);
router.put('/:id', authenticate, isAdmin, validateCategory, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

// Recipe assignment routes (protected)
router.post('/assign', authenticate, isAdmin, categoryController.assignRecipeToCategory);
router.delete('/assign/:categoryId/:recipeId', authenticate, isAdmin, categoryController.removeRecipeFromCategory);

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.get('/recipes/:categoryId', categoryController.getRecipesByCategory);
router.get('/search', categoryController.searchCategories);

export default router;