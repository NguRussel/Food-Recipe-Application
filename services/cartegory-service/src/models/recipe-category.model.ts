import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeCategory extends Document {
  recipeId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeCategorySchema: Schema = new Schema({
  recipeId: { type: String, required: true, index: true },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true,
    index: true 
  },
}, { timestamps: true });

// Compound index for faster lookups
RecipeCategorySchema.index({ recipeId: 1, categoryId: 1 }, { unique: true });

export default mongoose.model<IRecipeCategory>('RecipeCategory', RecipeCategorySchema);