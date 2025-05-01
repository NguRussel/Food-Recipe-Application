import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: jwt.JwtPayload;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
