import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const searchQuerySchema = Joi.object({
  query: Joi.string().allow('').optional(),
  culture: Joi.string().optional(),
  category: Joi.array().items(Joi.string()).optional(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
  maxPrepTime: Joi.number().min(0).optional(),
  maxCookTime: Joi.number().min(0).optional(),
  ingredients: Joi.array().items(Joi.string()).optional(),
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(50).optional()
});

const recipeIndexSchema = Joi.object({
  recipeId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string()).required(),
  culture: Joi.string().required(),
  category: Joi.array().items(Joi.string()).required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  preparationTime: Joi.number().min(0).required(),
  cookingTime: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string()).optional()
});

export const validateSearchQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await searchQuerySchema.validateAsync(req.query);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateRecipeIndex = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await recipeIndexSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};