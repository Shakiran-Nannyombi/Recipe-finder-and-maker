import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inventoryApi } from './inventoryApi';
import { apiClient } from './api';
import { UserInventory, InventoryItem, RecipeMatches } from '../types/recipe';

// Mock the API client
vi.mock('./api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
    APIClientError: class APIClientError extends Error {
        constructor(public statusCode: number, message: string) {
            super(message);
        }
    },
}));

describe('inventoryApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getInventory', () => {
        it('should fetch user inventory', async () => {
            const mockInventory: UserInventory = {
                user_id: 'user-1',
                items: [
                    { ingredient_name: 'tomatoes', quantity: '2 lbs', added_at: '2024-01-01T00:00:00Z' },
                ],
                updated_at: '2024-01-01T00:00:00Z',
            };

            vi.mocked(apiClient.get).mockResolvedValue({
                data: mockInventory,
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const result = await inventoryApi.getInventory();

            expect(apiClient.get).toHaveBeenCalledWith('/api/inventory');
            expect(result.data).toEqual(mockInventory);
        });
    });

    describe('addItem', () => {
        it('should add item to inventory', async () => {
            const mockItem: InventoryItem = {
                ingredient_name: 'rice',
                quantity: '1 cup',
                added_at: '2024-01-01T00:00:00Z',
            };

            vi.mocked(apiClient.post).mockResolvedValue({
                data: mockItem,
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const result = await inventoryApi.addItem({
                ingredient_name: 'rice',
                quantity: '1 cup',
            });

            expect(apiClient.post).toHaveBeenCalledWith('/api/inventory/items', {
                ingredient_name: 'rice',
                quantity: '1 cup',
            });
            expect(result.data).toEqual(mockItem);
        });
    });

    describe('removeItem', () => {
        it('should remove item from inventory', async () => {
            vi.mocked(apiClient.delete).mockResolvedValue({
                data: { deleted: true },
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const result = await inventoryApi.removeItem('tomatoes');

            expect(apiClient.delete).toHaveBeenCalledWith('/api/inventory/items/tomatoes');
            expect(result.data.deleted).toBe(true);
        });

        it('should encode ingredient name in URL', async () => {
            vi.mocked(apiClient.delete).mockResolvedValue({
                data: { deleted: true },
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            await inventoryApi.removeItem('bell peppers');

            expect(apiClient.delete).toHaveBeenCalledWith('/api/inventory/items/bell%20peppers');
        });
    });

    describe('matchRecipes', () => {
        it('should fetch recipe matches', async () => {
            const mockMatches: RecipeMatches = {
                exact_matches: [],
                partial_matches: [],
            };

            vi.mocked(apiClient.post).mockResolvedValue({
                data: mockMatches,
                meta: { timestamp: '2024-01-01T00:00:00Z' },
            });

            const result = await inventoryApi.matchRecipes();

            expect(apiClient.post).toHaveBeenCalledWith('/api/recipes/match-inventory', {});
            expect(result.data).toEqual(mockMatches);
        });
    });
});
