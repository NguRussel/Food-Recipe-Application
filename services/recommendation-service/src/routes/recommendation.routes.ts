import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const recommendationController = new RecommendationController();

router.get('/personalized', authenticate, recommendationController.getPersonalizedRecommendations.bind(recommendationController));
router.get('/trending', recommendationController.getTrendingRecipes.bind(recommendationController));
router.get('/similar/:recipeId', recommendationController.getSimilarRecipes.bind(recommendationController));

export default router;