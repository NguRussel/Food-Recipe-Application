import { Request, Response } from 'express';
import Rating from '../models/rating.model';

export const addRating = async (req: Request, res: Response) => {
  try {
    const rating = new Rating(req.body);
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

export const deleteRating = async (req: Request, res: Response) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
