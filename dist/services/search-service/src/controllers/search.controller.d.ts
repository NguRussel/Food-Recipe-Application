import { Request, Response } from 'express';
export declare class SearchController {
    private searchService;
    constructor();
    searchRecipes(req: Request, res: Response): Promise<void>;
    indexRecipe(req: Request, res: Response): Promise<void>;
    updateRecipeIndex(req: Request, res: Response): Promise<void>;
    deleteRecipeIndex(req: Request, res: Response): Promise<void>;
}
