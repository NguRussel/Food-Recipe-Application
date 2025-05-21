import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};