import { Request, Response } from 'express';
import Category, { ICategory } from '../models/category.model';
import RecipeCategory from '../models/recipe-category.model';

export class CategoryController {
  // Admin-side operations
  public async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category: ICategory = new Category(req.body);
      const savedCategory = await category.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      // First check if category has recipes
      const recipeCount = await RecipeCategory.countDocuments({ categoryId: req.params.id });
      
      // If safeguard is enabled and recipes exist, don't delete
      if (recipeCount > 0 && req.query.force !== 'true') {
        res.status(400).json({ 
          error: 'Category has associated recipes', 
          recipeCount,
          message: 'Use force=true query parameter to delete anyway'
        });
        return;
      }
      
      // Delete category
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      // Delete all recipe-category relationships
      if (recipeCount > 0) {
        await RecipeCategory.deleteMany({ categoryId: req.params.id });
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

  public async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  // Recipe assignment operations
  public async assignRecipeToCategory(req: Request, res: Response): Promise<void> {
    try {
      const { recipeId, categoryId } = req.body;
      
      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      // Create or update the relationship
      const recipeCategory = await RecipeCategory.findOneAndUpdate(
        { recipeId, categoryId },
        { recipeId, categoryId },
        { upsert: true, new: true }
      );
      
      res.status(200).json(recipeCategory);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async removeRecipeFromCategory(req: Request, res: Response): Promise<void> {
    try {
      const { recipeId, categoryId } = req.params;
      
      const result = await RecipeCategory.findOneAndDelete({ recipeId, categoryId });
      if (!result) {
        res.status(404).json({ error: 'Recipe not assigned to this category' });
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

  // User-side operations
  public async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const filter: any = {};
      
      // Filter by type if provided
      if (req.query.type) {
        filter.type = req.query.type;
      }
      
      const categories = await Category.find(filter);
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getRecipesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.categoryId;
      
      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      // Find all recipe IDs in this category
      const recipeCategories = await RecipeCategory.find({ categoryId });
      const recipeIds = recipeCategories.map(rc => rc.recipeId);
      
      // Return the recipe IDs (the actual recipe service will handle fetching the recipes)
      res.status(200).json({
        category,
        recipeIds
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async searchCategories(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res.status(400).json({ error: 'Search term is required' });
        return;
      }
      
      const categories = await Category.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}