import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRecipeGenerator } from './useRecipeGenerator';
import { recipeApi } from '../services/recipeApi';
import { Recipe } from '../types/recipe';

// Mock the recipe API
vi.mock('../services/recipeApi', () => ({
    recipeApi: {
        generateRecipe: vi.fn(),
    },
}));

describe('useRecipeGenerator', () => {
    const mockRecipe: Recipe = {
        id: '1',
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: [{ name: 'chicken', quantity: '500', unit: 'g' }],
        instructions: ['Cook it'],
        cooking_time_minutes: 30,
        servings: 4,
        difficulty: 'easy',
        cuisine_type: 'italian',
        dietary_tags: [],
        created_at: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with default state', () => {
        const { result } = renderHook(() => useRecipeGenerator());

        expect(result.current.recipe).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(false);
    });

    it('generates recipe successfully', async () => {
        vi.mocked(recipeApi.generateRecipe).mockResolvedValue({
            data: mockRecipe,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });

        const { result } = renderHook(() => useRecipeGenerator());

        result.current.generateRecipe({
            ingredients: ['chicken', 'rice'],
        });

        // Should be loading
        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.recipe).toEqual(mockRecipe);
        expect(result.current.success).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('handles API error', async () => {
        const errorMessage = 'API Error';
        vi.mocked(recipeApi.generateRecipe).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useRecipeGenerator());

        result.current.generateRecipe({
            ingredients: ['chicken'],
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.recipe).toBeNull();
        expect(result.current.success).toBe(false);
        expect(result.current.error).toBe(errorMessage);
    });

    it('validates empty ingredients', async () => {
        const { result } = renderHook(() => useRecipeGenerator());

        await result.current.generateRecipe({
            ingredients: [],
        });

        expect(result.current.error).toBe('Please add at least one ingredient');
        expect(result.current.loading).toBe(false);
        expect(recipeApi.generateRecipe).not.toHaveBeenCalled();
    });

    it('resets state', async () => {
        vi.mocked(recipeApi.generateRecipe).mockResolvedValue({
            data: mockRecipe,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });

        const { result } = renderHook(() => useRecipeGenerator());

        result.current.generateRecipe({
            ingredients: ['chicken'],
        });

        await waitFor(() => {
            expect(result.current.success).toBe(true);
        });

        result.current.reset();

        expect(result.current.recipe).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(false);
    });
});
