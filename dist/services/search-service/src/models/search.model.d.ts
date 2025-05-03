import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ISearchIndex, {}, {}, {}, mongoose.Document<unknown, {}, ISearchIndex, {}> & ISearchIndex & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
