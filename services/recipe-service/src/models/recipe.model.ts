import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  instructions: [String],
  culture: { type: String, required: true },
  preparationTime: Number,
  cookingTime: Number,
  servings: Number,
  allergens: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Recipe = mongoose.model('Recipe', recipeSchema);