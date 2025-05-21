"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClarifaiService = void 0;
const clarifai_1 = require("../config/clarifai");
const fs_1 = __importDefault(require("fs"));
class ClarifaiService {
    constructor() {
        // Food model ID from Clarifai
        this.FOOD_MODEL_ID = 'bd367be194cf45149e75f01d59f77ba7';
        this.FOOD_MODEL_VERSION_ID = 'dfebc169854e429086aceb8368662641';
    }
    /**
     * Analyze image using Clarifai's food model
     * @param imagePath Path to the image file or base64 string
     * @param isBase64 Whether the image is a base64 string
     */
    async analyzeImage(imagePath, isBase64 = false) {
        return new Promise((resolve, reject) => {
            let imageBytes;
            if (isBase64) {
                // If image is base64, remove the prefix if present
                const base64Data = imagePath.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                imageBytes = Buffer.from(base64Data, 'base64');
            }
            else {
                // Read image file
                try {
                    imageBytes = fs_1.default.readFileSync(imagePath);
                }
                catch (error) {
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
            clarifai_1.stub.PostModelOutputs(request, clarifai_1.metadata, (err, response) => {
                if (err) {
                    return reject(new Error(`Clarifai API error: ${err}`));
                }
                if (response.status.code !== 10000) {
                    return reject(new Error(`Clarifai API error: ${response.status.description}`));
                }
                // Process and return the results
                const ingredients = [];
                if (response.outputs && response.outputs.length > 0) {
                    const concepts = response.outputs[0].data.concepts;
                    if (concepts && concepts.length > 0) {
                        concepts.forEach((concept) => {
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
exports.ClarifaiService = ClarifaiService;
exports.default = new ClarifaiService();
//# sourceMappingURL=clarifai.service.js.map