import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const profileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
  dietaryPreferences: Joi.array().items(Joi.string()),
  allergies: Joi.array().items(Joi.string()),
  cookingSkillLevel: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  preferredCuisines: Joi.array().items(Joi.string()),
  favoriteRecipes: Joi.array().items(Joi.string())
});

export const validateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await profileSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};