import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const notificationSchema = Joi.object({
  type: Joi.string().valid('push', 'email', 'system').required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.object().optional(),
  userId: Joi.string().optional()
});

const preferencesSchema = Joi.object({
  pushEnabled: Joi.boolean(),
  emailEnabled: Joi.boolean(),
  recipeUpdates: Joi.boolean(),
  systemAnnouncements: Joi.boolean(),
  deviceTokens: Joi.array().items(Joi.string()),
  email: Joi.string().email()
}).min(1);

export const validateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await notificationSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Validation error' });
  }
};

export const validatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await preferencesSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Validation error' });
  }
};