import { useState, useEffect, useCallback } from 'react';
import { inventoryApi, AddInventoryItemRequest } from '../services/inventoryApi';
import { UserInventory, InventoryItem, RecipeMatches } from '../types/recipe';
import { APIClientError } from '../services/api';

interface UseInventoryReturn {
    inventory: UserInventory | null;
    matches: RecipeMatches | null;
    loading: boolean;
    error: string | null;
    addItem: (request: AddInventoryItemRequest) => Promise<void>;
    removeItem: (ingredientName: string) => Promise<void>;
    refreshInventory: () => Promise<void>;
    refreshMatches: () => Promise<void>;
}

/**
 * Hook for managing user inventory and recipe matches
 */
export const useInventory = (): UseInventoryReturn => {
    const [inventory, setInventory] = useState<UserInventory | null>(null);
    const [matches, setMatches] = useState<RecipeMatches | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch user inventory
     */
    const refreshInventory = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await inventoryApi.getInventory();
            setInventory(response.data);
        } catch (err) {
            if (err instanceof APIClientError) {
                setError(err.message);
            } else {
                setError('Failed to load inventory');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch recipe matches
     */
    const refreshMatches = useCallback(async () => {
        setError(null);

        try {
            const response = await inventoryApi.matchRecipes();
            setMatches(response.data);
        } catch (err) {
            if (err instanceof APIClientError) {
                setError(err.message);
            } else {
                setError('Failed to load recipe matches');
            }
        }
    }, []);

    /**
     * Add item to inventory with optimistic update
     */
    const addItem = useCallback(async (request: AddInventoryItemRequest) => {
        setError(null);

        // Optimistic update
        const newItem: InventoryItem = {
            ingredient_name: request.ingredient_name,
            quantity: request.quantity,
            added_at: new Date().toISOString(),
        };

        if (inventory) {
            setInventory({
                ...inventory,
                items: [...inventory.items, newItem],
                updated_at: new Date().toISOString(),
            });
        }

        try {
            await inventoryApi.addItem(request);
            // Refresh to get server state
            await refreshInventory();
            // Refresh matches after adding item
            await refreshMatches();
        } catch (err) {
            // Revert optimistic update on error
            await refreshInventory();

            if (err instanceof APIClientError) {
                setError(err.message);
            } else {
                setError('Failed to add item');
            }
            throw err;
        }
    }, [inventory, refreshInventory, refreshMatches]);

    /**
     * Remove item from inventory with optimistic update
     */
    const removeItem = useCallback(async (ingredientName: string) => {
        setError(null);

        // Optimistic update
        if (inventory) {
            setInventory({
                ...inventory,
                items: inventory.items.filter(item => item.ingredient_name !== ingredientName),
                updated_at: new Date().toISOString(),
            });
        }

        try {
            await inventoryApi.removeItem(ingredientName);
            // Refresh to get server state
            await refreshInventory();
            // Refresh matches after removing item
            await refreshMatches();
        } catch (err) {
            // Revert optimistic update on error
            await refreshInventory();

            if (err instanceof APIClientError) {
                setError(err.message);
            } else {
                setError('Failed to remove item');
            }
            throw err;
        }
    }, [inventory, refreshInventory, refreshMatches]);

    // Load inventory on mount
    useEffect(() => {
        refreshInventory();
        refreshMatches();
    }, [refreshInventory, refreshMatches]);

    return {
        inventory,
        matches,
        loading,
        error,
        addItem,
        removeItem,
        refreshInventory,
        refreshMatches,
    };
};

export default useInventory;
