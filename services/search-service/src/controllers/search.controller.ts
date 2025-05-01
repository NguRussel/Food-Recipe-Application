import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  public async searchRecipes(req: Request, res: Response): Promise<void> {
    try {
      const { query, ...filters } = req.query;
      const results = await this.searchService.searchRecipes(query as string, filters);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Search operation failed' });
    }
  }

  public async indexRecipe(req: Request, res: Response): Promise<void> {
    try {
      const indexed = await this.searchService.indexRecipe(req.body);
      res.status(201).json(indexed);
    } catch (error) {
      res.status(400).json({ error: 'Failed to index recipe' });
    }
  }

  public async updateRecipeIndex(req: Request, res: Response): Promise<void> {
    try {
      const updated = await this.searchService.updateRecipeIndex(req.params.recipeId, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Recipe not found in index' });
        return;
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update recipe index' });
    }
  }

  public async deleteRecipeIndex(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.searchService.deleteRecipeIndex(req.params.recipeId);
      if (!deleted) {
        res.status(404).json({ error: 'Recipe not found in index' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete recipe index' });
    }
  }
}