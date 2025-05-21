import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  recipeId: string;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  recipeId: { type: String, required: true, index: true },
}, { timestamps: true });

// Compound index for faster lookups and to ensure a user can only favorite a recipe once
FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema);