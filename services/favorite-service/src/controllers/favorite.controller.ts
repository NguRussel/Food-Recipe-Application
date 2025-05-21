import { Request, Response } from 'express';
import Favorite from '../models/favorite.model';

export class FavoriteController {
  
  // Add a recipe to favorites
  public async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { recipeId } = req.body;
      const userId = req.user?.sub || req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User ID not found in token' });
        return;
      }
      
      // Check if already favorited
      const existingFavorite = await Favorite.findOne({ userId, recipeId });
      if (existingFavorite) {
        res.status(409).json({ error: 'Recipe already in favorites' });
        return;
      }
      
      const favorite = new Favorite({ userId, recipeId });
      await favorite.save();
      
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
  
  // Remove a recipe from favorites
  public async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params;
      const userId = req.user?.sub || req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User ID not found in token' });
        return;
      }
      
      const result = await Favorite.findOneAndDelete({ userId, recipeId });
      
      if (!result) {
        res.status(404).json({ error: 'Favorite not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
  
  // Get all favorites for a user
  public async getUserFavorites(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.sub || req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User ID not found in token' });
        return;
      }
      
      const favorites = await Favorite.find({ userId });
      res.status(200).json(favorites);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
  
  // Check if a recipe is favorited by the user
  public async checkFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { recipeId } = req.params;
      const userId = req.user?.sub || req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User ID not found in token' });
        return;
      }
      
      const favorite = await Favorite.findOne({ userId, recipeId });
      res.status(200).json({ isFavorite: !!favorite });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
}