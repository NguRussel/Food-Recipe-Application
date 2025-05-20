"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUtils = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class ImageUtils {
    /**
     * Save base64 image to disk
     * @param base64Data Base64 encoded image data
     * @returns Path to saved image
     */
    saveBase64Image(base64Data) {
        // Remove data URI prefix if present
        const base64Image = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const imageBuffer = Buffer.from(base64Image, 'base64');
        // Create uploads directory if it doesn't exist
        const uploadsDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        // Generate unique filename
        const filename = `${(0, uuid_1.v4)()}.jpg`;
        const filePath = path_1.default.join(uploadsDir, filename);
        // Write file to disk
        fs_1.default.writeFileSync(filePath, imageBuffer);
        return filePath;
    }
    /**
     * Delete image file
     * @param filePath Path to image file
     */
    deleteImage(filePath) {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error(`Error deleting image: ${error.message}`);
        }
    }
    /**
     * Validate image file type
     * @param mimeType MIME type of the image
     * @returns Whether the image type is allowed
     */
    isValidImageType(mimeType) {
        const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg').split(',');
        return allowedTypes.includes(mimeType);
    }
}
exports.ImageUtils = ImageUtils;
exports.default = new ImageUtils();
//# sourceMappingURL=imageUtils.js.map