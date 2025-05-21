import { IIngredient, IMatchedRecipe } from '../models/scanResults.model';
export declare class RecipeMatchService {
    private recipeServiceUrl;
    constructor();
    /**
     * Find recipes that match the detected ingredients
     * @param ingredients List of detected ingredients
     */
    findMatchingRecipes(ingredients: IIngredient[]): Promise<IMatchedRecipe[]>;
}
declare const _default: RecipeMatchService;
export default _default;
