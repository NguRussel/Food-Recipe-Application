import { IIngredient } from '../models/scanResults.model';
export declare class ClarifaiService {
    private FOOD_MODEL_ID;
    private FOOD_MODEL_VERSION_ID;
    /**
     * Analyze image using Clarifai's food model
     * @param imagePath Path to the image file or base64 string
     * @param isBase64 Whether the image is a base64 string
     */
    analyzeImage(imagePath: string, isBase64?: boolean): Promise<IIngredient[]>;
}
declare const _default: ClarifaiService;
export default _default;
