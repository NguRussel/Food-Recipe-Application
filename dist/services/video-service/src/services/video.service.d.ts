import { IVideo } from '../models/video.model';
export declare class VideoService {
    private s3;
    private upload;
    constructor();
    getUploadMiddleware(): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    createVideo(videoData: Partial<IVideo>): Promise<IVideo>;
    getVideo(videoId: string): Promise<IVideo | null>;
    getVideosByRecipe(recipeId: string): Promise<IVideo[]>;
    getVideosByUser(userId: string): Promise<IVideo[]>;
    updateVideo(videoId: string, updateData: Partial<IVideo>): Promise<IVideo | null>;
    deleteVideo(videoId: string): Promise<boolean>;
    incrementViews(videoId: string): Promise<void>;
}
