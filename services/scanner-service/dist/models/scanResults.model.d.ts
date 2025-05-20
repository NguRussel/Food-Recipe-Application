import mongoose, { Document } from 'mongoose';
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
declare const ScanResult: mongoose.Model<IScanResult, {}, {}, {}, mongoose.Document<unknown, {}, IScanResult, {}> & IScanResult & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ScanResult;
