import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInventory } from './useInventory';
import { inventoryApi } from '../services/inventoryApi';
import { UserInventory, RecipeMatches } from '../types/recipe';

// Mock the inventory API
vi.mock('../services/inventoryApi', () => ({
    inventoryApi: {
        getInventory: vi.fn(),
        addItem: vi.fn(),
        removeItem: vi.fn(),
        matchRecipes: vi.fn(),
    },
}));

describe('useInventory', () => {
    const mockInventory: UserInventory = {
        user_id: 'user-1',
        items: [
            { ingredient_name: 'tomatoes', quantity: '2 lbs', added_at: '2024-01-01T00:00:00Z' },
            { ingredient_name: 'chicken', added_at: '2024-01-01T00:00:00Z' },
        ],
        updated_at: '2024-01-01T00:00:00Z',
    };

    const mockMatches: RecipeMatches = {
        exact_matches: [],
        partial_matches: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(inventoryApi.getInventory).mockResolvedValue({
            data: mockInventory,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });
        vi.mocked(inventoryApi.matchRecipes).mockResolvedValue({
            data: mockMatches,
            meta: { timestamp: '2024-01-01T00:00:00Z' },
        });
    });

    it('should load inventory on mount', async () => {
        const { result } = renderHook(() => useInventory());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.inventory).toEqual(mockInventory);
        expect(inventoryApi.getInventory).toHaveBeenCalledTimes(1);
    });

    it('should load recipe matches on mount', async () => {
        const { result } = renderHook(() => useInventory());

        await waitFor(() => {
            expect(result.current.matches).toEqual(mockMatches);
        });

        expect(inventoryApi.matchRecipes).toHaveBeenCalledTimes(1);
    });

    it('should add item to inventory', async () => {
        const newItem = { ingredient_name: 'rice', quantity: '1 cup', added_at: '2024-01-02T00:00:00Z' };

        vi.mocked(inventoryApi.addItem).mockResolvedValue({
            data: newItem,
            meta: { timestamp: '2024-01-02T00:00:00Z' },
        });

        const { result } = renderHook(() => useInventory());

        await waitFor(() => {
            expect(result.current.inventory).toBeTruthy();
        });

        await result.current.addItem({ ingredient_name: 'rice', quantity: '1 cup' });

        expect(inventoryApi.addItem).toHaveBeenCalledWith({
            ingredient_name: 'rice',
            quantity: '1 cup',
        });
    });

    it('should remove item from inventory', async () => {
        vi.mocked(inventoryApi.removeItem).mockResolvedValue({
            data: { deleted: true },
            meta: { timestamp: '2024-01-02T00:00:00Z' },
        });

        const { result } = renderHook(() => useInventory());

        await waitFor(() => {
            expect(result.current.inventory).toBeTruthy();
        });

        await result.current.removeItem('tomatoes');

        expect(inventoryApi.removeItem).toHaveBeenCalledWith('tomatoes');
    });

    it('should handle errors when loading inventory', async () => {
        vi.mocked(inventoryApi.getInventory).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useInventory());

        await waitFor(() => {
            expect(result.current.error).toBe('Failed to load inventory');
        });
    });
});
