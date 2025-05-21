import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { validateProfile } from '../middleware/profile.validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const profileController = new ProfileController();

router.post('/', authenticate, validateProfile, profileController.createProfile);
router.get('/:userId', authenticate, profileController.getProfile);
router.put('/:userId', authenticate, validateProfile, profileController.updateProfile);
router.patch('/:userId/preferences', authenticate, profileController.updatePreferences);
router.post('/:userId/favorites/:recipeId', authenticate, profileController.addFavoriteRecipe);
router.delete('/:userId/favorites/:recipeId', authenticate, profileController.removeFavoriteRecipe);

export default router;