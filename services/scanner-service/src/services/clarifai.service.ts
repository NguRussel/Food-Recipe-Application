import { stub, metadata } from '../config/clarifai';
import { IIngredient } from '../models/scanResults.model';
import fs from 'fs';

export class ClarifaiService {
  // Food model ID from Clarifai
  private FOOD_MODEL_ID = 'bd367be194cf45149e75f01d59f77ba7';
  private FOOD_MODEL_VERSION_ID = 'dfebc169854e429086aceb8368662641';

  /**
   * Analyze image using Clarifai's food model
   * @param imagePath Path to the image file or base64 string
   * @param isBase64 Whether the image is a base64 string
   */
  public async analyzeImage(imagePath: string, isBase64: boolean = false): Promise<IIngredient[]> {
    return new Promise((resolve, reject) => {
      let imageBytes;
      
      if (isBase64) {
        // If image is base64, remove the prefix if present
        const base64Data = imagePath.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        imageBytes = Buffer.from(base64Data, 'base64');
      } else {
        // Read image file
        try {
          imageBytes = fs.readFileSync(imagePath);
        } catch (error) {
          return reject(new Error(`Failed to read image file: ${error instanceof Error ? error.message : String(error)}`));
        }
      }

      // Prepare request for Clarifai API
      const request = {
        user_app_id: {
          user_id: 'clarifai',
          app_id: 'main'
        },
        model_id: this.FOOD_MODEL_ID,
        version_id: this.FOOD_MODEL_VERSION_ID,
        inputs: [
          {
            data: {
              image: {
                base64: imageBytes
              }
            }
          }
        ]
      };

      // Call Clarifai API
      stub.PostModelOutputs(request, metadata, (err: any, response: any) => {
        if (err) {
          return reject(new Error(`Clarifai API error: ${err}`));
        }

        if (response.status.code !== 10000) {
          return reject(new Error(`Clarifai API error: ${response.status.description}`));
        }

        // Process and return the results
        const ingredients: IIngredient[] = [];
        
        if (response.outputs && response.outputs.length > 0) {
          const concepts = response.outputs[0].data.concepts;
          
          if (concepts && concepts.length > 0) {
            concepts.forEach((concept: { name: string; value: number }) => {
              // Only include concepts with confidence > 0.5
              if (concept.value > 0.5) {
                ingredients.push({
                  name: concept.name,
                  confidence: concept.value
                });
              }
            });
          }
        }

        resolve(ingredients);
      });
    });
  }
}

export default new ClarifaiService();