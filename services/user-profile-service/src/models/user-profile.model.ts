import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dietaryPreferences: string[];
  allergies: string[];
  cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredCuisines: string[];
  favoriteRecipes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  dietaryPreferences: [{ type: String }],
  allergies: [{ type: String }],
  cookingSkillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  preferredCuisines: [{ type: String }],
  favoriteRecipes: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);