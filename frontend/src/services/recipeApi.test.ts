import { describe, it, expect, beforeEach, vi } from 'vitest';
import { recipeApi } from './recipeApi';
import { apiClient } from './api';
import { Recipe } from '../types/recipe';

// Mock the apiClient
vi.mock('./api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('recipeApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockRecipe: Recipe = {
        id: '1',
        title: 'Tomato Pasta',
        description: 'A delicious pasta dish',
        ingredients: [
            { name: 'tomato', quantity: '2', unit: 'cups' },
            { name: 'pasta', quantity: '200', unit: 'g' },
        ],
        instructions: ['Boil pasta', 'Add tomatoes', 'Mix and serve'],
        cooking_time_minutes: 20,
        servings: 2,
        difficulty: 'easy',
        cuisine_type: 'Italian',
        dietary_tags: ['vegetarian'],
        created_at: '2026-02-21T10:30:00Z',
    };

    describe('generateRecipe', () => {
        it('should generate a recipe with ingredients and preferences', async () => {
            const request = {
                ingredients: ['tomato', 'pasta'],
                dietary_restrictions: ['vegetarian'],
                cuisine_type: 'Italian',
                difficulty: 'easy',
            };

            const mockResponse = {
                data: mockRecipe,
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.generateRecipe(request);

            expect(apiClient.post).toHaveBeenCalledWith('/api/recipes/generate', request);
            expect(result.data).toEqual(mockRecipe);
            expect(result.meta.timestamp).toBe('2026-02-21T10:30:00Z');
        });

        it('should generate a recipe with minimal request data', async () => {
            const request = {
                ingredients: ['chicken', 'rice'],
            };

            const mockResponse = {
                data: mockRecipe,
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.generateRecipe(request);

            expect(apiClient.post).toHaveBeenCalledWith('/api/recipes/generate', request);
            expect(result.data).toEqual(mockRecipe);
        });
    });

    describe('searchRecipes', () => {
        it('should search recipes with query', async () => {
            const request = {
                query: 'pasta recipes',
                limit: 10,
            };

            const mockResponse = {
                data: [mockRecipe],
                meta: { timestamp: '2026-02-21T10:30:00Z', total: 1 },
            };

            vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.searchRecipes(request);

            expect(apiClient.post).toHaveBeenCalledWith('/api/recipes/search', request);
            expect(result.data).toEqual([mockRecipe]);
            expect(result.data.length).toBe(1);
        });

        it('should search recipes with available ingredients filter', async () => {
            const request = {
                query: 'quick dinner',
                available_ingredients: ['chicken', 'rice', 'onion'],
                limit: 5,
            };

            const mockResponse = {
                data: [mockRecipe],
                meta: { timestamp: '2026-02-21T10:30:00Z', total: 1 },
            };

            vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.searchRecipes(request);

            expect(apiClient.post).toHaveBeenCalledWith('/api/recipes/search', request);
            expect(result.data).toEqual([mockRecipe]);
        });

        it('should handle empty search results', async () => {
            const request = {
                query: 'nonexistent recipe',
            };

            const mockResponse = {
                data: [],
                meta: { timestamp: '2026-02-21T10:30:00Z', total: 0 },
            };

            vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.searchRecipes(request);

            expect(result.data).toEqual([]);
            expect(result.data.length).toBe(0);
        });
    });

    describe('getRecipe', () => {
        it('should get a recipe by ID', async () => {
            const recipeId = '123';

            const mockResponse = {
                data: mockRecipe,
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.getRecipe(recipeId);

            expect(apiClient.get).toHaveBeenCalledWith('/api/recipes/123');
            expect(result.data).toEqual(mockRecipe);
        });

        it('should handle recipe not found', async () => {
            const recipeId = '999';

            vi.mocked(apiClient.get).mockRejectedValueOnce(
                new Error('Recipe not found')
            );

            await expect(recipeApi.getRecipe(recipeId)).rejects.toThrow(
                'Recipe not found'
            );
        });
    });

    describe('listRecipes', () => {
        it('should list recipes with default pagination', async () => {
            const mockResponse = {
                data: [mockRecipe],
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.listRecipes();

            expect(apiClient.get).toHaveBeenCalledWith('/api/recipes', {
                limit: 10,
                offset: 0,
            });
            expect(result.data).toEqual([mockRecipe]);
        });

        it('should list recipes with custom pagination', async () => {
            const mockResponse = {
                data: [mockRecipe],
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.listRecipes(20, 10);

            expect(apiClient.get).toHaveBeenCalledWith('/api/recipes', {
                limit: 20,
                offset: 10,
            });
            expect(result.data).toEqual([mockRecipe]);
        });

        it('should handle empty recipe list', async () => {
            const mockResponse = {
                data: [],
                meta: { timestamp: '2026-02-21T10:30:00Z' },
            };

            vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

            const result = await recipeApi.listRecipes();

            expect(result.data).toEqual([]);
            expect(result.data.length).toBe(0);
        });
    });
});
