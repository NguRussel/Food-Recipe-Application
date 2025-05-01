import SearchIndex, { ISearchIndex } from '../models/search.model';

export class SearchService {
  public async searchRecipes(query: string, filters?: any): Promise<ISearchIndex[]> {
    const searchQuery: any = {};

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (filters) {
      if (filters.culture) searchQuery.culture = filters.culture;
      if (filters.category) searchQuery.category = { $in: filters.category };
      if (filters.difficulty) searchQuery.difficulty = filters.difficulty;
      if (filters.maxPrepTime) searchQuery.preparationTime = { $lte: filters.maxPrepTime };
      if (filters.maxCookTime) searchQuery.cookingTime = { $lte: filters.maxCookTime };
      if (filters.ingredients) searchQuery.ingredients = { $all: filters.ingredients };
    }

    return SearchIndex.find(searchQuery)
      .sort({ searchScore: -1 })
      .limit(20);
  }

  public async indexRecipe(recipeData: any): Promise<ISearchIndex> {
    const searchDoc = new SearchIndex({
      ...recipeData,
      tags: this.generateTags(recipeData)
    });
    return searchDoc.save();
  }

  public async updateRecipeIndex(recipeId: string, recipeData: any): Promise<ISearchIndex | null> {
    return SearchIndex.findOneAndUpdate(
      { recipeId },
      {
        ...recipeData,
        tags: this.generateTags(recipeData)
      },
      { new: true }
    );
  }

  public async deleteRecipeIndex(recipeId: string): Promise<boolean> {
    const result = await SearchIndex.deleteOne({ recipeId });
    return result.deletedCount > 0;
  }

  private generateTags(recipeData: any): string[] {
    const tags = new Set<string>();
    
    // Add normalized title words
    recipeData.title.toLowerCase().split(' ').forEach((word: string) => tags.add(word));
    
    // Add culture
    tags.add(recipeData.culture.toLowerCase());
    
    // Add categories
    recipeData.category.forEach((cat: string) => tags.add(cat.toLowerCase()));
    
    // Add ingredients
    recipeData.ingredients.forEach((ing: string) => tags.add(ing.toLowerCase()));
    
    return Array.from(tags);
  }
}