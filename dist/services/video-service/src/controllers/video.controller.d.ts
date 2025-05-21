import { Request, Response } from 'express';
export declare class VideoController {
    private videoService;
    constructor();
    uploadVideo(req: Request, res: Response): Promise<void>;
    getVideo(req: Request, res: Response): Promise<void>;
    getVideosByRecipe(req: Request, res: Response): Promise<void>;
    getVideosByUser(req: Request, res: Response): Promise<void>;
    updateVideo(req: Request, res: Response): Promise<void>;
    deleteVideo(req: Request, res: Response): Promise<void>;
}
