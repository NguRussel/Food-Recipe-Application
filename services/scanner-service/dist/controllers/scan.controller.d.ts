import { Request, Response } from 'express';
export declare class ScanController {
    /**
     * Scan image uploaded as a file
     */
    scanImageFile(req: Request, res: Response): Promise<void>;
    /**
     * Scan image provided as base64 data
     */
    scanImageBase64(req: Request, res: Response): Promise<void>;
    /**
     * Process the image, detect ingredients, and find matching recipes
     */
    private processImage;
    /**
     * Get scan history for a user
     */
    getScanHistory(req: Request, res: Response): Promise<void>;
}
declare const _default: ScanController;
export default _default;
