import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const videoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  recipeId: Joi.string().required(),
  thumbnailUrl: Joi.string().uri().required(),
  duration: Joi.number().required(),
  quality: Joi.string().required()
});

export const validateVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await videoSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};