import { apiClient, ApiResponse } from './api';
import { UserInventory, InventoryItem, RecipeMatches } from '../types/recipe';

export interface AddInventoryItemRequest {
    ingredient_name: string;
    quantity?: string;
}

/**
 * Inventory API service
 */
export const inventoryApi = {
    /**
     * Get user's inventory
     */
    async getInventory(): Promise<ApiResponse<UserInventory>> {
        return apiClient.get<UserInventory>('/api/inventory');
    },

    /**
     * Add an item to inventory
     */
    async addItem(request: AddInventoryItemRequest): Promise<ApiResponse<InventoryItem>> {
        return apiClient.post<InventoryItem>('/api/inventory/items', request);
    },

    /**
     * Remove an item from inventory
     */
    async removeItem(ingredientName: string): Promise<ApiResponse<{ deleted: boolean }>> {
        return apiClient.delete<{ deleted: boolean }>(`/api/inventory/items/${encodeURIComponent(ingredientName)}`);
    },

    /**
     * Get recipe matches based on current inventory
     */
    async matchRecipes(): Promise<ApiResponse<RecipeMatches>> {
        return apiClient.post<RecipeMatches>('/api/recipes/match-inventory', {});
    },
};

export default inventoryApi;
