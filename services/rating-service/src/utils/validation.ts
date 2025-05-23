import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateRating = (req: Request, res: Response, next: NextFunction) => {
  const { userId, recipeId, stars } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!recipeId) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'Stars must be a number between 1 and 5' });
  }

  next();
};