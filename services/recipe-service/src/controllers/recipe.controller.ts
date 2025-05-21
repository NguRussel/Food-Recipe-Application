import { Request, Response } from 'express';
import Recipe, { IRecipe } from '../models/recipe.model';

export class RecipeController {
  public async createRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipe: IRecipe = new Recipe(req.body);
      const savedRecipe = await recipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      res.status(200).json(recipe);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async updateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      res.status(200).json(recipe);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipe = await Recipe.findByIdAndDelete(req.params.id);
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: 'An unknown error occurred' });
        }
      }
    }

  public async getRecipesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const recipes = await Recipe.find({ category: req.params.category });
      res.status(200).json(recipes);
    } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: 'An unknown error occurred' });
        }
      }
    }

  public async getRecipesByCulture(req: Request, res: Response): Promise<void> {
    try {
      const recipes = await Recipe.find({ culture: req.params.culture });
      res.status(200).json(recipes);
    } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: 'An unknown error occurred' });
        }
      }
    }
  }
