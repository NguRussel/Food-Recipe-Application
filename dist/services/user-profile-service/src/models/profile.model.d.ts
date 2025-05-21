import mongoose from 'mongoose';
export declare const Profile: mongoose.Model<{
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    preferences?: {
        allergies: string[];
        favoriteRecipes: mongoose.Types.ObjectId[];
        dietaryRestrictions: string[];
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    preferences?: {
        allergies: string[];
        favoriteRecipes: mongoose.Types.ObjectId[];
        dietaryRestrictions: string[];
    } | null | undefined;
}, {}> & {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    preferences?: {
        allergies: string[];
        favoriteRecipes: mongoose.Types.ObjectId[];
        dietaryRestrictions: string[];
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    preferences?: {
        allergies: string[];
        favoriteRecipes: mongoose.Types.ObjectId[];
        dietaryRestrictions: string[];
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    preferences?: {
        allergies: string[];
        favoriteRecipes: mongoose.Types.ObjectId[];
        dietaryRestrictions: string[];
    } | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    preferences?: {
        allergies: string[];
        favoriteRecipes: mongoose.Types.ObjectId[];
        dietaryRestrictions: string[];
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
