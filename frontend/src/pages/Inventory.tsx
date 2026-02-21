import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryList, AddIngredient, RecipeMatches } from '../components/Inventory';

/**
 * Inventory page - Manage ingredients and view matching recipes
 */
export const Inventory: React.FC = () => {
    const { inventory, matches, loading, error, addItem, removeItem, refreshMatches } = useInventory();

    const handleAddItem = async (ingredientName: string, quantity?: string) => {
        await addItem({
            ingredient_name: ingredientName,
            quantity,
        });
    };

    const handleRemoveItem = async (ingredientName: string) => {
        await removeItem(ingredientName);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Inventory</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your ingredients and discover recipes you can make right now.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Add Ingredient Form */}
                    <div className="lg:col-span-1">
                        <AddIngredient onAdd={handleAddItem} loading={loading} />
                    </div>

                    {/* Right Column - Inventory List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Current Inventory
                                </h2>
                                {inventory && inventory.items.length > 0 && (
                                    <span className="text-sm text-gray-600">
                                        {inventory.items.length} {inventory.items.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>

                            {loading && !inventory ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-gray-600">Loading inventory...</p>
                                </div>
                            ) : (
                                <InventoryList
                                    items={inventory?.items || []}
                                    onRemove={handleRemoveItem}
                                    loading={loading}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Recipe Matches Section */}
                {inventory && inventory.items.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Recipes You Can Make
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Based on your current inventory
                                    </p>
                                </div>
                                <button
                                    onClick={refreshMatches}
                                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                            <RecipeMatches matches={matches} loading={loading} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
