import RecipeInteraction, { IRecipeInteraction } from '../models/recommendation.model';
import { createClient } from '@redis/client';
import fetch from 'node-fetch';
import { readdirSync } from 'fs';

interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  allergies: string[];
  cookingSkillLevel: string;
}

interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  difficulty: string;
  ingredients: string[];
  rating: number;
  viewCount: number;
}

export class RecommendationService {
  private redis;

  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL
    });
    this.redis.connect();
  }

  async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Recipe[]> {
    try {
      // Get user preferences
      const userPrefs = await this.getUserPreferences(userId);
      
      // Get user interaction history
      const interactions = await RecipeInteraction.find({ userId })
        .sort({ timestamp: -1 })
        .limit(50);

      // Get recipes from recipe service
      const recipes = await this.getRecipes();

      // Calculate personalization scores
      const scoredRecipes = recipes.map(recipe => ({
        ...recipe,
        score: this.calculatePersonalizationScore(recipe, userPrefs, interactions)
      }));

      // Sort and return top N recipes
      return scoredRecipes
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      throw new Error('Failed to get personalized recommendations');
    }
  }

  async getTrendingRecipes(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<Recipe[]> {
    try {
      const cacheKey = `trending:${timeframe}`;
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const timeframeHours = {
        day: 24,
        week: 168,
        month: 720
      };

      const since = new Date();
      since.setHours(since.getHours() - timeframeHours[timeframe]);

      const interactions = await RecipeInteraction.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: '$recipeId',
          score: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ['$interactionType', 'view'] }, then: 1 },
                  { case: { $eq: ['$interactionType', 'like'] }, then: 3 },
                  { case: { $eq: ['$interactionType', 'save'] }, then: 5 },
                  { case: { $eq: ['$interactionType', 'cook'] }, then: 10 }
                ],
                default: 0
              }
            }
          }
        }},
        { $sort: { score: -1 } },
        { $limit: 20 }
      ]);

      const recipes = await this.getRecipesByIds(interactions.map(i => i._id));
      await this.redis.setEx(cacheKey, 3600, JSON.stringify(recipes));

      return recipes;
    } catch (error) {
      throw new Error('Failed to get trending recipes');
    }
  }

  async getSimilarRecipes(recipeId: string, limit: number = 5): Promise<Recipe[]> {
    try {
      const recipe = await this.getRecipeById(recipeId);
      if (!recipe) throw new Error('Recipe not found');

      const recipes = await this.getRecipes();
      
      const similarRecipes = recipes
        .filter(r => r.id !== recipeId)
        .map(r => ({
          ...r,
          similarity: this.calculateRecipeSimilarity(recipe, r)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return similarRecipes;
    } catch (error) {
      throw new Error('Failed to get similar recipes');
    }
  }

  private calculatePersonalizationScore(
    recipe: Recipe,
    preferences: UserPreferences,
    interactions: IRecipeInteraction[]
  ): number {
    let score = 0;

    // Preference matching
    if (preferences.cuisinePreferences.includes(recipe.cuisine)) score += 2;
    if (recipe.difficulty === preferences.cookingSkillLevel) score += 1;

    // Interaction history
    const recipeInteractions = interactions.filter(i => i.recipeId === recipe.id);
    if (recipeInteractions.length > 0) {
      score += recipeInteractions.reduce((sum, i) => {
        switch (i.interactionType) {
          case 'view': return sum + 0.5;
          case 'like': return sum + 1;
          case 'save': return sum + 2;
          case 'cook': return sum + 3;
          default: return sum;
        }
      }, 0);
    }

    // Recipe popularity
    score += (recipe.rating * 0.5) + (Math.log(recipe.viewCount + 1) * 0.3);

    return score;
  }

  private calculateRecipeSimilarity(recipe1: Recipe, recipe2: Recipe): number {
    let similarity = 0;

    // Cuisine similarity
    if (recipe1.cuisine === recipe2.cuisine) similarity += 2;

    // Ingredient similarity
    const commonIngredients = recipe1.ingredients.filter(i => 
      recipe2.ingredients.includes(i)
    ).length;
    similarity += (commonIngredients / Math.max(recipe1.ingredients.length, recipe2.ingredients.length)) * 3;

    // Difficulty similarity
    if (recipe1.difficulty === recipe2.difficulty) similarity += 1;

    return similarity;
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    const response = await fetch(`${process.env.USER_PROFILE_SERVICE_URL}/api/profiles/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user preferences');
    return response.json();
  }

  private async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${process.env.RECIPE_SERVICE_URL}/api/recipes`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  }

  private async getRecipeById(recipeId: string): Promise<Recipe | null> {
    const response = await fetch(`${process.env.RECIPE_SERVICE_URL}/api/recipes/${recipeId}`);
    if (!response.ok) return null;
    return response.json();
  }

  private async getRecipesByIds(recipeIds: string[]): Promise<Recipe[]> {
    const recipes = await Promise.all(
      recipeIds.map(id => this.getRecipeById(id))
    );
    return recipes.filter((r): r is Recipe => r !== null);
  }
}