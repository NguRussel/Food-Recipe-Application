import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors.length > 0 && { errors }),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};