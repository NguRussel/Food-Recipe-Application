import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  type: 'ethnic_group' | 'region' | 'meal_type' | 'occasion';
  parentId?: string; // For hierarchical categories if needed
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ethnic_group', 'region', 'meal_type', 'occasion'], 
    required: true,
    index: true
  },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  thumbnailUrl: { type: String },
}, { timestamps: true });

// Text index for search functionality
CategorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ICategory>('Category', CategorySchema);