import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';

export class RecommendationController {
  private recommendationService: RecommendationService;

  constructor() {
    this.recommendationService = new RecommendationService();
  }

  public async getPersonalizedRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await this.recommendationService.getPersonalizedRecommendations(userId, limit);
      res.status(200).json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get personalized recommendations' });
    }
  }

  public async getTrendingRecipes(req: Request, res: Response): Promise<void> {
    try {
      const timeframe = (req.query.timeframe as 'day' | 'week' | 'month') || 'week';
      const trending = await this.recommendationService.getTrendingRecipes(timeframe);
      res.status(200).json(trending);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get trending recipes' });
    }
  }

  public async getSimilarRecipes(req: Request, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;
      const similar = await this.recommendationService.getSimilarRecipes(recipeId, limit);
      res.status(200).json(similar);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get similar recipes' });
    }
  }
}