import mongoose, { Document } from 'mongoose';
export interface IIngredient {
    name: string;
    quantity: number;
    unit: string;
}
export interface IRecipe extends Document {
    title: string;
    description: string;
    ingredients: IIngredient[];
    instructions: string[];
    preparationTime: number;
    cookingTime: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    culture: string;
    category: string[];
    authorId: string;
    images: string[];
    videoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IRecipe, {}, {}, {}, mongoose.Document<unknown, {}, IRecipe, {}> & IRecipe & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
