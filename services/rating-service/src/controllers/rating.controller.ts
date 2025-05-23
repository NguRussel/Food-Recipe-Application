import { Request, Response } from 'express';
import Rating from '../models/rating.model';

export const addRating = async (req: Request, res: Response) => {
  try {
    const { recipeId, stars, comment } = req.body;
    const userId = req.user?.sub || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    // Check if user has already rated this recipe
    const existingRating = await Rating.findOne({ userId, recipeId });
    
    if (existingRating) {
      // Update existing rating
      existingRating.stars = stars;
      if (comment !== undefined) {
        existingRating.comment = comment;
      }
      await existingRating.save();
      return res.status(200).json(existingRating);
    }

    // Create new rating
    const rating = new Rating({
      userId,
      recipeId,
      stars,
      comment
    });
    await rating.save();
    res.status(201).json(rating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRatingsByRecipe = async (req: Request, res: Response) => {
  try {
    const ratings = await Rating.find({ recipeId: req.params.recipeId });
    res.status(200).json(ratings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAverageRatingByRecipe = async (req: Request, res: Response) => {
  try {
    const result = await Rating.aggregate([
      { $match: { recipeId: req.params.recipeId } },
      { 
        $group: { 
          _id: "$recipeId", 
          averageRating: { $avg: "$stars" },
          totalRatings: { $sum: 1 }
        } 
      }
    ]);
    
    if (result.length === 0) {
      return res.status(200).json({ averageRating: 0, totalRatings: 0 });
    }
    
    res.status(200).json({
      averageRating: parseFloat(result[0].averageRating.toFixed(1)),
      totalRatings: result[0].totalRatings
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
    
    const ratings = await Rating.find({ userId });
    res.status(200).json(ratings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
    
    // Find the rating and ensure it belongs to the user
    const rating = await Rating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    if (rating.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this rating' });
    }
    
    await Rating.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
