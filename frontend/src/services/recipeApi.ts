import { apiClient, ApiResponse } from './api';
import { Recipe } from '../types/recipe';

export interface RecipeGenerationRequest {
    ingredients: string[];
    dietary_restrictions?: string[];
    cuisine_type?: string;
    difficulty?: string;
}

export interface SearchRequest {
    query: string;
    available_ingredients?: string[];
    limit?: number;
}

/**
 * Recipe API service
 */
export const recipeApi = {
    /**
     * Generate a new recipe based on ingredients and preferences
     */
    async generateRecipe(request: RecipeGenerationRequest): Promise<ApiResponse<Recipe>> {
        return apiClient.post<Recipe>('/api/recipes/generate', request);
    },

    /**
     * Search for recipes
     */
    async searchRecipes(request: SearchRequest): Promise<ApiResponse<Recipe[]>> {
        return apiClient.post<Recipe[]>('/api/recipes/search', request);
    },

    /**
     * Get a recipe by ID
     */
    async getRecipe(recipeId: string): Promise<ApiResponse<Recipe>> {
        return apiClient.get<Recipe>(`/api/recipes/${recipeId}`);
    },

    /**
     * List all recipes with pagination
     */
    async listRecipes(limit: number = 10, offset: number = 0): Promise<ApiResponse<Recipe[]>> {
        return apiClient.get<Recipe[]>('/api/recipes', { limit, offset });
    },
};

export default recipeApi;
