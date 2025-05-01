import { Request, Response } from 'express';
export declare class ProfileController {
    createProfile(req: Request, res: Response): Promise<void>;
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    updatePreferences(req: Request, res: Response): Promise<void>;
    addFavoriteRecipe(req: Request, res: Response): Promise<void>;
    removeFavoriteRecipe(req: Request, res: Response): Promise<void>;
}
