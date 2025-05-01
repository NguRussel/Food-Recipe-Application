import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchIndex extends Document {
  recipeId: string;
  title: string;
  description: string;
  ingredients: string[];
  culture: string;
  category: string[];
  difficulty: string;
  preparationTime: number;
  cookingTime: number;
  tags: string[];
  searchScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const SearchIndexSchema: Schema = new Schema({
  recipeId: { type: String, required: true, unique: true },
  title: { type: String, required: true, index: true },
  description: { type: String, required: true, index: true },
  ingredients: [{ type: String, index: true }],
  culture: { type: String, required: true, index: true },
  category: [{ type: String, required: true, index: true }],
  difficulty: { type: String, required: true },
  preparationTime: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  tags: [{ type: String, index: true }],
  searchScore: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for full-text search
SearchIndexSchema.index(
  { title: 'text', description: 'text', ingredients: 'text', tags: 'text' },
  { weights: { title: 10, description: 5, ingredients: 3, tags: 2 } }
);

export default mongoose.model<ISearchIndex>('SearchIndex', SearchIndexSchema);