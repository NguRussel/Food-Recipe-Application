import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  name: string;
  confidence: number;
}

export interface IMatchedRecipe {
  recipeId: string;
  title: string;
  matchScore: number;
  matchedIngredients: string[];
}

export interface IScanResult extends Document {
  userId: string;
  imageUrl: string;
  detectedIngredients: IIngredient[];
  matchedRecipes: IMatchedRecipe[];
  createdAt: Date;
}

const ScanResultSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  detectedIngredients: [{
    name: { type: String, required: true },
    confidence: { type: Number, required: true }
  }],
  matchedRecipes: [{
    recipeId: { type: String, required: true },
    title: { type: String, required: true },
    matchScore: { type: Number, required: true },
    matchedIngredients: [{ type: String }]
  }],
}, { timestamps: true });

// Create indexes for faster queries
ScanResultSchema.index({ createdAt: -1 });
ScanResultSchema.index({ 'detectedIngredients.name': 1 });

const ScanResult = mongoose.model<IScanResult>('ScanResult', ScanResultSchema);

export default ScanResult;