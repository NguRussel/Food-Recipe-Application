import { MealPlan, IMealPlan } from '../models/meal-plan.model';
import { IMealPlanScheduleDay, IMealPlanMeal, MealType } from '../types/meal-plan.types';
import { RecipeService } from './recipe.service';
import { ValidationError } from '../utils/errors';

interface Recipe {
  id: string;
  estimatedCost: number;
  preparationTime: number;
  cookingTime: number;
  rating: number;
}

export class PlannerService {
  private recipeService: RecipeService;
  private readonly MEAL_TIMES: Record<Exclude<MealType, 'snack'>, { start: number; end: number }> = {
    breakfast: { start: 6, end: 10 },
    lunch: { start: 11, end: 15 },
    dinner: { start: 16, end: 22 }
  };

  constructor() {
    this.recipeService = new RecipeService();
  }

  async createMealPlan(planData: Partial<IMealPlan>): Promise<IMealPlan> {
    try {
      this.validatePlanData(planData);

      const budget = planData.budget!;
      const numberOfPeople = planData.numberOfPeople!;
      const perPersonBudget = budget.total / numberOfPeople;
      const maxPerMeal = perPersonBudget / 3;

      const mealPlan = new MealPlan({
        ...planData,
        budget: {
          ...budget,
          perPerson: perPersonBudget,
          maxPerMeal
        },
        status: 'draft'
      });

      return await mealPlan.save();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(
        `Failed to create meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateMealSchedule(planId: string): Promise<IMealPlan> {
    try {
      const plan = await MealPlan.findById(planId);
      if (!plan) throw new ValidationError('Meal plan not found');

      const days = this.calculateDays(plan.duration.startDate, plan.duration.endDate);
      const mealSchedule = await this.generateScheduleForDays(plan, days);

      plan.mealSchedule = mealSchedule;
      plan.status = 'active';
      return await plan.save();
    } catch (error) {
      throw new Error(
        `Failed to generate meal schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async generateScheduleForDays(plan: IMealPlan, days: number): Promise<IMealPlanScheduleDay[]> {
    const mealSchedule: IMealPlanScheduleDay[] = [];

    for (let i = 0; i < days; i++) {
      const date = this.addDays(plan.duration.startDate, i);
      const dayMeals = await this.generateDayMeals({
        date,
        budget: plan.budget.perPerson,
        preferences: plan.preferences,
        numberOfPeople: plan.numberOfPeople,
        maxPerMeal: plan.budget.maxPerMeal
      });

      mealSchedule.push(dayMeals);
    }

    return mealSchedule;
  }

  private async generateDayMeals(params: {
    date: Date;
    budget: number;
    preferences: IMealPlan['preferences'];
    numberOfPeople: number;
    maxPerMeal?: number;
  }): Promise<IMealPlanScheduleDay> {
    const mealTypes: Exclude<MealType, 'snack'>[] = ['breakfast', 'lunch', 'dinner'];
    const meals: IMealPlanMeal[] = [];

    for (const mealType of mealTypes) {
      const recipes = await this.recipeService.findSuitableRecipes({
        budget: params.maxPerMeal || (params.budget / 3),
        preferences: {
          dietaryRestrictions: params.preferences.dietaryRestrictions || [],
          cuisinePreferences: params.preferences.cuisinePreferences || [],
          allergies: params.preferences.allergies || []
        },
        servings: params.numberOfPeople
      });

      if (recipes.length > 0) {
        const selectedRecipe = this.selectBestRecipe(recipes as unknown as Recipe[], params.maxPerMeal);
        
        meals.push({
          type: mealType,
          recipeId: selectedRecipe.id,
          servingSize: params.numberOfPeople,
          estimatedCost: selectedRecipe.estimatedCost * params.numberOfPeople,
          preparationTime: selectedRecipe.preparationTime,
          cookingTime: selectedRecipe.cookingTime
        });
      }
    }

    return {
      date: params.date,
      meals,
      totalCost: meals.reduce((sum, meal) => sum + meal.estimatedCost, 0)
    };
  }

  private validatePlanData(data: Partial<IMealPlan>): void {
    if (!data.userId) throw new ValidationError('User ID is required');
    if (!data.purpose?.type) throw new ValidationError('Purpose type is required');
    if (!data.numberOfPeople || data.numberOfPeople < 1) {
      throw new ValidationError('Valid number of people is required');
    }
    if (!data.budget?.total || data.budget.total <= 0) {
      throw new ValidationError('Valid budget is required');
    }
    if (!data.duration?.startDate || !data.duration?.endDate) {
      throw new ValidationError('Valid duration is required');
    }
    if (new Date(data.duration.startDate) >= new Date(data.duration.endDate)) {
      throw new ValidationError('End date must be after start date');
    }
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private getMealTimeRange(mealType: MealType, customTimings?: IMealPlan['preferences']['mealTimings']) {
    // Check if custom timing exists for this meal type
    if (customTimings && 
        (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') && 
        customTimings[mealType]) {
      return customTimings[mealType];
    }
    
    // Check if it's a standard meal type (not snack)
    if (mealType !== 'snack' && mealType in this.MEAL_TIMES) {
      return this.MEAL_TIMES[mealType as keyof typeof this.MEAL_TIMES];
    }
    
    // Default timing for snacks or unknown meal types
    return { start: '0:00', end: '23:59' };
  }

  private selectBestRecipe(recipes: Recipe[], maxBudget?: number): Recipe {
    return recipes
      .filter(recipe => !maxBudget || recipe.estimatedCost <= maxBudget)
      .sort((a, b) => {
        const aScore = a.rating - (maxBudget ? a.estimatedCost / maxBudget : 0);
        const bScore = b.rating - (maxBudget ? b.estimatedCost / maxBudget : 0);
        return bScore - aScore;
      })[0];
  }
}