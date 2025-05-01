import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUserProfile, {}, {}, {}, mongoose.Document<unknown, {}, IUserProfile, {}> & IUserProfile & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
