import { Request, Response, NextFunction } from 'express';
export declare const rateLimit: (requestsPerMinute?: number) => (req: Request, res: Response, next: NextFunction) => void;
