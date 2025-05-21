export declare class ImageUtils {
    /**
     * Save base64 image to disk
     * @param base64Data Base64 encoded image data
     * @returns Path to saved image
     */
    saveBase64Image(base64Data: string): string;
    /**
     * Delete image file
     * @param filePath Path to image file
     */
    deleteImage(filePath: string): void;
    /**
     * Validate image file type
     * @param mimeType MIME type of the image
     * @returns Whether the image type is allowed
     */
    isValidImageType(mimeType: string): boolean;
}
declare const _default: ImageUtils;
export default _default;
