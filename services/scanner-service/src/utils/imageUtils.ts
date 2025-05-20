import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ImageUtils {
  /**
   * Save base64 image to disk
   * @param base64Data Base64 encoded image data
   * @returns Path to saved image
   */
  public saveBase64Image(base64Data: string): string {
    // Remove data URI prefix if present
    const base64Image = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const filename = `${uuidv4()}.jpg`;
    const filePath = path.join(uploadsDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filePath, imageBuffer);
    
    return filePath;
  }
  
  /**
   * Delete image file
   * @param filePath Path to image file
   */
  public deleteImage(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error deleting image: ${error.message}`);
      } else {
        console.error('Error deleting image: Unknown error');
      }
    }
  }
  
  /**
   * Validate image file type
   * @param mimeType MIME type of the image
   * @returns Whether the image type is allowed
   */
  public isValidImageType(mimeType: string): boolean {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg').split(',');
    return allowedTypes.includes(mimeType);
  }
}

export default new ImageUtils();