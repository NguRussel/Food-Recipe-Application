import { Request, Response } from 'express';
export declare class RecipeController {
    createRecipe(req: Request, res: Response): Promise<void>;
    getRecipe(req: Request, res: Response): Promise<void>;
    updateRecipe(req: Request, res: Response): Promise<void>;
    deleteRecipe(req: Request, res: Response): Promise<void>;
    getRecipesByCategory(req: Request, res: Response): Promise<void>;
    getRecipesByCulture(req: Request, res: Response): Promise<void>;
}
