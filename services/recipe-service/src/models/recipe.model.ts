import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  ingredients: IIngredient[];
  instructions: string[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  culture: string;
  category: string[];
  authorId: string;
  images: string[];
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema: Schema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
  instructions: [{ type: String, required: true }],
  preparationTime: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  culture: { type: String, required: true, index: true },
  category: [{ type: String, required: true }],
  authorId: { type: String, required: true, index: true },
  images: [{ type: String }],
  videoUrl: { type: String },
}, { timestamps: true });

RecipeSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);