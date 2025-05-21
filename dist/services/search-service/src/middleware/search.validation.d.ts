import { Request, Response, NextFunction } from 'express';
export declare const validateSearchQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateRecipeIndex: (req: Request, res: Response, next: NextFunction) => Promise<void>;
