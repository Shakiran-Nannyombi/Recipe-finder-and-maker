import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRecipeSearch } from './useRecipeSearch';
import { recipeApi } from '../services/recipeApi';
import { APIClientError } from '../services/api';

// Mock the recipeApi
vi.mock('../services/recipeApi', () => ({
    recipeApi: {
        searchRecipes: vi.fn(),
    },
}));

describe('useRecipeSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useRecipeSearch());

        expect(result.current.results).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.query).toBe('');
    });

    it('should handle successful search', async () => {
        const mockRecipes = [
            {
                id: '1',
                title: 'Pasta Carbonara',
                description: 'Classic Italian pasta',
                ingredients: [{ name: 'pasta', quantity: '200g' }],
                instructions: ['Cook pasta', 'Add sauce'],
                cooking_time_minutes: 20,
                servings: 2,
                difficulty: 'easy' as const,
                dietary_tags: [],
                created_at: '2024-01-01T00:00:00Z',
            },
        ];

        vi.mocked(recipeApi.searchRecipes).mockResolvedValue({
            data: mockRecipes,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: 'pasta' });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.results).toEqual(mockRecipes);
        expect(result.current.error).toBe(null);
        expect(result.current.query).toBe('pasta');
        expect(recipeApi.searchRecipes).toHaveBeenCalledWith({ query: 'pasta' });
    });

    it('should handle search with additional parameters', async () => {
        const mockRecipes = [
            {
                id: '2',
                title: 'Chicken Salad',
                description: 'Healthy salad',
                ingredients: [{ name: 'chicken', quantity: '200g' }],
                instructions: ['Cook chicken', 'Mix with greens'],
                cooking_time_minutes: 15,
                servings: 1,
                difficulty: 'easy' as const,
                dietary_tags: ['gluten-free'],
                created_at: '2024-01-01T00:00:00Z',
            },
        ];

        vi.mocked(recipeApi.searchRecipes).mockResolvedValue({
            data: mockRecipes,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({
                query: 'chicken',
                available_ingredients: ['chicken', 'lettuce'],
                limit: 5,
            });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.results).toEqual(mockRecipes);
        expect(recipeApi.searchRecipes).toHaveBeenCalledWith({
            query: 'chicken',
            available_ingredients: ['chicken', 'lettuce'],
            limit: 5,
        });
    });

    it('should validate empty query', async () => {
        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: '' });
        });

        expect(result.current.error).toBe('Please enter a search query');
        expect(result.current.loading).toBe(false);
        expect(recipeApi.searchRecipes).not.toHaveBeenCalled();
    });

    it('should validate whitespace-only query', async () => {
        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: '   ' });
        });

        expect(result.current.error).toBe('Please enter a search query');
        expect(result.current.loading).toBe(false);
        expect(recipeApi.searchRecipes).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
        const apiError = new APIClientError(500, 'Internal server error');
        vi.mocked(recipeApi.searchRecipes).mockRejectedValue(apiError);

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: 'pasta' });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Internal server error');
        expect(result.current.results).toEqual([]);
    });

    it('should handle generic errors', async () => {
        const genericError = new Error('Network error');
        vi.mocked(recipeApi.searchRecipes).mockRejectedValue(genericError);

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: 'pasta' });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Network error');
        expect(result.current.results).toEqual([]);
    });

    it('should handle unknown errors', async () => {
        vi.mocked(recipeApi.searchRecipes).mockRejectedValue('Unknown error');

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: 'pasta' });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to search recipes. Please try again.');
        expect(result.current.results).toEqual([]);
    });

    it('should set loading state during search', async () => {
        vi.mocked(recipeApi.searchRecipes).mockImplementation(
            () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                data: [],
                                meta: { timestamp: '2024-01-01T00:00:00Z' },
                            }),
                        100
                    )
                )
        );

        const { result } = renderHook(() => useRecipeSearch());

        act(() => {
            result.current.search({ query: 'pasta' });
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    it('should reset state', async () => {
        const mockRecipes = [
            {
                id: '1',
                title: 'Test Recipe',
                description: 'Test',
                ingredients: [],
                instructions: [],
                cooking_time_minutes: 10,
                servings: 1,
                difficulty: 'easy' as const,
                dietary_tags: [],
                created_at: '2024-01-01T00:00:00Z',
            },
        ];

        vi.mocked(recipeApi.searchRecipes).mockResolvedValue({
            data: mockRecipes,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: 'test' });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.results).toEqual(mockRecipes);
        expect(result.current.query).toBe('test');

        act(() => {
            result.current.reset();
        });

        expect(result.current.results).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.query).toBe('');
    });

    it('should preserve query on error', async () => {
        const apiError = new APIClientError(404, 'No recipes found');
        vi.mocked(recipeApi.searchRecipes).mockRejectedValue(apiError);

        const { result } = renderHook(() => useRecipeSearch());

        await act(async () => {
            await result.current.search({ query: 'nonexistent' });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.query).toBe('nonexistent');
        expect(result.current.error).toBe('No recipes found');
    });

    describe('debounced search', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should debounce search calls', async () => {
            const mockRecipes = [
                {
                    id: '1',
                    title: 'Pasta',
                    description: 'Test',
                    ingredients: [],
                    instructions: [],
                    cooking_time_minutes: 10,
                    servings: 1,
                    difficulty: 'easy' as const,
                    dietary_tags: [],
                    created_at: '2024-01-01T00:00:00Z',
                },
            ];

            vi.mocked(recipeApi.searchRecipes).mockResolvedValue({
                data: mockRecipes,
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const { result } = renderHook(() => useRecipeSearch());

            // Call debouncedSearch multiple times rapidly
            act(() => {
                result.current.debouncedSearch({ query: 'p' });
                result.current.debouncedSearch({ query: 'pa' });
                result.current.debouncedSearch({ query: 'pas' });
                result.current.debouncedSearch({ query: 'pasta' });
            });

            // API should not be called yet
            expect(recipeApi.searchRecipes).not.toHaveBeenCalled();

            // Fast-forward time by 400ms (default delay) and run all timers
            await act(async () => {
                vi.advanceTimersByTime(400);
                await vi.runAllTimersAsync();
            });

            // API should be called only once with the last query
            expect(recipeApi.searchRecipes).toHaveBeenCalledTimes(1);
            expect(recipeApi.searchRecipes).toHaveBeenCalledWith({ query: 'pasta' });
        });

        it('should use custom delay for debouncing', async () => {
            const mockRecipes = [
                {
                    id: '1',
                    title: 'Chicken',
                    description: 'Test',
                    ingredients: [],
                    instructions: [],
                    cooking_time_minutes: 10,
                    servings: 1,
                    difficulty: 'easy' as const,
                    dietary_tags: [],
                    created_at: '2024-01-01T00:00:00Z',
                },
            ];

            vi.mocked(recipeApi.searchRecipes).mockResolvedValue({
                data: mockRecipes,
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const { result } = renderHook(() => useRecipeSearch());

            act(() => {
                result.current.debouncedSearch({ query: 'chicken' }, 500);
            });

            // API should not be called after 400ms
            act(() => {
                vi.advanceTimersByTime(400);
            });
            expect(recipeApi.searchRecipes).not.toHaveBeenCalled();

            // API should be called after 500ms
            await act(async () => {
                vi.advanceTimersByTime(100);
                await vi.runAllTimersAsync();
            });

            expect(recipeApi.searchRecipes).toHaveBeenCalledTimes(1);
            expect(recipeApi.searchRecipes).toHaveBeenCalledWith({ query: 'chicken' });
        });

        it('should update query immediately but delay API call', () => {
            const { result } = renderHook(() => useRecipeSearch());

            act(() => {
                result.current.debouncedSearch({ query: 'pasta' });
            });

            // Query should be updated immediately
            expect(result.current.query).toBe('pasta');

            // But API should not be called yet
            expect(recipeApi.searchRecipes).not.toHaveBeenCalled();
        });

        it('should cancel previous debounced call when new one is made', async () => {
            const mockRecipes = [
                {
                    id: '1',
                    title: 'Pizza',
                    description: 'Test',
                    ingredients: [],
                    instructions: [],
                    cooking_time_minutes: 10,
                    servings: 1,
                    difficulty: 'easy' as const,
                    dietary_tags: [],
                    created_at: '2024-01-01T00:00:00Z',
                },
            ];

            vi.mocked(recipeApi.searchRecipes).mockResolvedValue({
                data: mockRecipes,
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const { result } = renderHook(() => useRecipeSearch());

            act(() => {
                result.current.debouncedSearch({ query: 'pasta' });
            });

            // Advance time by 200ms (not enough to trigger)
            act(() => {
                vi.advanceTimersByTime(200);
            });

            // Make another call, which should cancel the previous one
            act(() => {
                result.current.debouncedSearch({ query: 'pizza' });
            });

            // Advance time by another 400ms
            await act(async () => {
                vi.advanceTimersByTime(400);
                await vi.runAllTimersAsync();
            });

            // API should be called only once with 'pizza', not 'pasta'
            expect(recipeApi.searchRecipes).toHaveBeenCalledTimes(1);
            expect(recipeApi.searchRecipes).toHaveBeenCalledWith({ query: 'pizza' });
        });

        it('should cleanup timeout on unmount', () => {
            const { result, unmount } = renderHook(() => useRecipeSearch());

            act(() => {
                result.current.debouncedSearch({ query: 'pasta' });
            });

            // Unmount before timeout completes
            unmount();

            // Advance time
            act(() => {
                vi.advanceTimersByTime(400);
            });

            // API should not be called after unmount
            expect(recipeApi.searchRecipes).not.toHaveBeenCalled();
        });
    });
});
