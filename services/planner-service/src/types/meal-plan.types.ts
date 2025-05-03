export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type PlanStatus = 'draft' | 'active' | 'completed';
export type EventType = 'event' | 'party' | 'household';

export interface IMealPlanPurpose {
  type: EventType;
  description: string;
  numberOfGuests?: number; // Optional for events/parties
}

export interface IMealPlanDuration {
  startDate: Date;
  endDate: Date;
}

export interface IMealPlanBudget {
  total: number;
  currency: string;
  perPerson: number;
  maxPerMeal?: number; // Optional budget constraint per meal
}

export interface IMealPlanPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  allergies: string[];
  mealTimings?: {
    breakfast?: { start: string; end: string };
    lunch?: { start: string; end: string };
    dinner?: { start: string; end: string };
  };
}

export interface IMealPlanMeal {
  type: MealType;
  recipeId: string;
  servingSize: number;
  estimatedCost: number;
  preparationTime: number;
  cookingTime: number;
}

export interface IMealPlanScheduleDay {
  date: Date;
  meals: IMealPlanMeal[];
  totalCost: number;
}