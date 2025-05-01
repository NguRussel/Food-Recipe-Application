import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      quantity: Joi.number().required(),
      unit: Joi.string().required()
    })
  ).required(),
  instructions: Joi.array().items(Joi.string()).required(),
  preparationTime: Joi.number().required(),
  cookingTime: Joi.number().required(),
  servings: Joi.number().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  culture: Joi.string().required(),
  category: Joi.array().items(Joi.string()).required(),
  authorId: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
  videoUrl: Joi.string().uri().optional()
});

export const validateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await recipeSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};