import React from 'react';
import { InventoryItem } from '../../types/recipe';

interface InventoryListProps {
    items: InventoryItem[];
    onRemove: (ingredientName: string) => void;
    loading?: boolean;
}

/**
 * Component to display inventory items with remove functionality
 */
export const InventoryList: React.FC<InventoryListProps> = ({ items, onRemove, loading = false }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Your inventory is empty. Add some ingredients to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div
                    key={item.ingredient_name}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 capitalize">
                            {item.ingredient_name}
                        </h3>
                        {item.quantity && (
                            <p className="text-sm text-gray-600 mt-1">
                                Quantity: {item.quantity}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(item.ingredient_name)}
                        disabled={loading}
                        className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Remove ${item.ingredient_name}`}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default InventoryList;
