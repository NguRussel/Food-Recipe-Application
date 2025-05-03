import mongoose, { Schema, Document } from 'mongoose';
import { IMealPlanPurpose, IMealPlanDuration, IMealPlanBudget, IMealPlanPreferences, IMealPlanScheduleDay } from '../types/meal-plan.types';

export interface IMealPlan extends Document {
  userId: string;
  purpose: IMealPlanPurpose;
  numberOfPeople: number;
  duration: IMealPlanDuration;
  budget: IMealPlanBudget;
  preferences: IMealPlanPreferences;
  mealSchedule: IMealPlanScheduleDay[];
  totalCost: number;
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  purpose: {
    type: { type: String, enum: ['event', 'party', 'household'], required: true },
    description: { type: String, required: true }
  },
  numberOfPeople: { type: Number, required: true, min: 1 },
  duration: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  budget: {
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    perPerson: { type: Number, required: true, min: 0 }
  },
  preferences: {
    dietaryRestrictions: [{ type: String }],
    cuisinePreferences: [{ type: String }],
    allergies: [{ type: String }]
  },
  mealSchedule: [{
    date: { type: Date, required: true },
    meals: [{
      type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
      recipeId: { type: String, required: true },
      servingSize: { type: Number, required: true },
      estimatedCost: { type: Number, required: true }
    }]
  }],
  totalCost: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  }
}, { timestamps: true });

export const MealPlan = mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);