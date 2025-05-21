import axios from 'axios';
import { IIngredient, IMatchedRecipe } from '../models/scanResults.model';
import dotenv from 'dotenv';

dotenv.config();

export class RecipeMatchService {
  private recipeServiceUrl: string;

  constructor() {
    this.recipeServiceUrl = process.env.RECIPE_SERVICE_URL || 'http://localhost:3002/api/recipes';
  }

  /**
   * Find recipes that match the detected ingredients
   * @param ingredients List of detected ingredients
   */
  public async findMatchingRecipes(ingredients: IIngredient[]): Promise<IMatchedRecipe[]> {
    try {
      // Get all recipes from the recipe service
      const response = await axios.get(`${this.recipeServiceUrl}`);
      const recipes = response.data;

      if (!recipes || !Array.isArray(recipes)) {
        throw new Error('Invalid response from recipe service');
      }

      // Extract ingredient names for easier matching
      const detectedIngredientNames = ingredients.map(ing => ing.name.toLowerCase());

      // Match recipes with detected ingredients
      const matchedRecipes: IMatchedRecipe[] = [];

      recipes.forEach(recipe => {
        const recipeIngredients = recipe.ingredients.map((ing: { name: string }) => ing.name.toLowerCase());
        const matchedIngredients: string[] = [];
        
        // Find matching ingredients
        recipeIngredients.forEach((recipeIng: string) => {
          detectedIngredientNames.forEach(detectedIng => {
            // Check if detected ingredient is part of recipe ingredient or vice versa
            if (recipeIng.includes(detectedIng) || detectedIng.includes(recipeIng)) {
              if (!matchedIngredients.includes(recipeIng)) {
                matchedIngredients.push(recipeIng);
              }
            }
          });
        });

        // Calculate match score (percentage of recipe ingredients matched)
        const matchScore = (matchedIngredients.length / recipeIngredients.length) * 100;

        // Only include recipes with at least one matching ingredient
        if (matchedIngredients.length > 0) {
          matchedRecipes.push({
            recipeId: recipe._id,
            title: recipe.title,
            matchScore,
            matchedIngredients
          });
        }
      });

      // Sort by match score (highest first)
      return matchedRecipes.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Error finding matching recipes:', error);
      return [];
    }
  }
}

export default new RecipeMatchService();