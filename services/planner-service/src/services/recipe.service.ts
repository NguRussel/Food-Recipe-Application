import axios from 'axios';
import { ValidationError } from '../utils/errors';

interface Recipe {
  id: string;
  name: string;
  estimatedCost: number;
  servings: number;
  preparationTime: number;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
  dietaryInfo: string[];
}

interface RecipeSearchParams {
  budget: number;
  preferences: {
    dietaryRestrictions: string[];
    cuisinePreferences: string[];
    allergies: string[];
  };
  servings: number;
}

export class RecipeService {
  private readonly apiUrl: string;

  constructor() {
    if (!process.env.RECIPE_SERVICE_URL) {
      throw new Error('RECIPE_SERVICE_URL environment variable is required');
    }
    this.apiUrl = process.env.RECIPE_SERVICE_URL;
  }

  async findSuitableRecipes(params: RecipeSearchParams): Promise<Recipe[]> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/recipes/search`, {
        maxCost: params.budget,
        servings: params.servings,
        dietaryRestrictions: params.preferences.dietaryRestrictions,
        cuisinePreferences: params.preferences.cuisinePreferences,
        excludeIngredients: params.preferences.allergies
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new ValidationError('Invalid response from recipe service');
      }

      return response.data.map(recipe => ({
        ...recipe,
        estimatedCost: this.calculateRecipeCost(recipe, params.servings)
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ValidationError(
          `Recipe service error: ${error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
  }

  private calculateRecipeCost(recipe: Recipe, requiredServings: number): number {
    const servingRatio = requiredServings / recipe.servings;
    return recipe.estimatedCost * servingRatio;
  }
}