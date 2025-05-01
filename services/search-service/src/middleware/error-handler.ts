import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      details: error.message
    });
    return;
  }

  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    res.status(500).json({
      error: 'Database Error',
      details: 'An error occurred while accessing the database'
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    details: 'An unexpected error occurred'
  });
};