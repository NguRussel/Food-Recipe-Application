import { ISearchIndex } from '../models/search.model';
export declare class SearchService {
    searchRecipes(query: string, filters?: any): Promise<ISearchIndex[]>;
    indexRecipe(recipeData: any): Promise<ISearchIndex>;
    updateRecipeIndex(recipeId: string, recipeData: any): Promise<ISearchIndex | null>;
    deleteRecipeIndex(recipeId: string): Promise<boolean>;
    private generateTags;
}
