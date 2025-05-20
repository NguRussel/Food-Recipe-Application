import mongoose, { Document, Schema } from 'mongoose';

export interface Rating extends Document {
  userId: string;
  recipeId: string;
  stars: number; // 1 to 5
  comment?: string;
}

const ratingSchema = new Schema<Rating>({
  userId: { type: String, required: true },
  recipeId: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

export default mongoose.model<Rating>('Rating', ratingSchema);
