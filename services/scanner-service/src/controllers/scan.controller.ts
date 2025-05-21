import { Request, Response } from 'express';
import clarifaiService from '../services/clarifai.service';
import recipeMatchService from '../services/recipeMatch.service';
import imageUtils from '../utils/imageUtils';
import ScanResult from '../models/scanResults.model';

export class ScanController {
  /**
   * Scan image uploaded as a file
   */
  public async scanImageFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      const imagePath = req.file.path;
      await this.processImage(req, res, imagePath, false);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred during image scanning' });
    }
  }

  /**
   * Scan image provided as base64 data
   */
  public async scanImageBase64(req: Request, res: Response): Promise<void> {
    try {
      const { imageData } = req.body;

      if (!imageData) {
        res.status(400).json({ error: 'No base64 image data provided' });
        return;
      }

      // Validate base64 format
      if (!imageData.startsWith('data:image/')) {
        res.status(400).json({ error: 'Invalid base64 image format' });
        return;
      }

      // Save base64 image to disk temporarily
      const imagePath = imageUtils.saveBase64Image(imageData);
      await this.processImage(req, res, imagePath, true);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred during image scanning' });
    }
  }

  /**
   * Process the image, detect ingredients, and find matching recipes
   */
  private async processImage(req: Request, res: Response, imagePath: string, isBase64: boolean): Promise<void> {
    try {
      // Analyze image with Clarifai
      const detectedIngredients = await clarifaiService.analyzeImage(imagePath, isBase64);

      if (detectedIngredients.length === 0) {
        // Clean up the image file
        imageUtils.deleteImage(imagePath);
        
        res.status(404).json({ 
          error: 'No ingredients detected in the image', 
          message: 'Please try another image with clearer food items.'
        });
        return;
      }

      // Find matching recipes
      const matchedRecipes = await recipeMatchService.findMatchingRecipes(detectedIngredients);

      // Save scan result to database
      const userId = req.user?.id || 'anonymous';
      const scanResult = new ScanResult({
        userId,
        imageUrl: imagePath,
        detectedIngredients,
        matchedRecipes
      });

      await scanResult.save();

      // Clean up the image file
      imageUtils.deleteImage(imagePath);

      // Return the results
      res.status(200).json({
        success: true,
        data: {
          scanId: scanResult._id,
          detectedIngredients,
          matchedRecipes
        }
      });
    } catch (error) {
      // Clean up the image file in case of error
      imageUtils.deleteImage(imagePath);
      throw error;
    }
  }

  /**
   * Get scan history for a user
   */
  public async getScanHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const scanHistory = await ScanResult.find({ userId })
        .sort({ createdAt: -1 })
        .select('-__v')
        .limit(10);

      res.status(200).json({
        success: true,
        data: scanHistory
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'An error occurred retrieving scan history' });
    }
  }
}

export default new ScanController();