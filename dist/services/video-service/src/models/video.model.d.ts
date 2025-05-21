import mongoose, { Document } from 'mongoose';
export interface IVideo extends Document {
    title: string;
    description: string;
    recipeId: string;
    userId: string;
    url: string;
    thumbnailUrl: string;
    duration: number;
    quality: string;
    size: number;
    views: number;
    status: 'processing' | 'ready' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IVideo, {}, {}, {}, mongoose.Document<unknown, {}, IVideo, {}> & IVideo & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
