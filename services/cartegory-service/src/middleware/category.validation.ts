import { Request, Response, NextFunction } from 'express';

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, type } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Category name is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Category description is required');
  }

  if (!type) {
    errors.push('Category type is required');
  } else if (!['ethnic_group', 'region', 'meal_type', 'occasion'].includes(type)) {
    errors.push('Category type must be one of: ethnic_group, region, meal_type, occasion');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};