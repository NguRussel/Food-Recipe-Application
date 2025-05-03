import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeInteraction extends Document {
  userId: string;
  recipeId: string;
  interactionType: 'view' | 'like' | 'save' | 'cook';
  rating?: number;
  timestamp: Date;
}

const RecipeInteractionSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  recipeId: { type: String, required: true, index: true },
  interactionType: { 
    type: String, 
    required: true,
    enum: ['view', 'like', 'save', 'cook']
  },
  rating: { type: Number, min: 1, max: 5 },
  timestamp: { type: Date, default: Date.now }
});

RecipeInteractionSchema.index({ userId: 1, recipeId: 1 });

export default mongoose.model<IRecipeInteraction>('RecipeInteraction', RecipeInteractionSchema);