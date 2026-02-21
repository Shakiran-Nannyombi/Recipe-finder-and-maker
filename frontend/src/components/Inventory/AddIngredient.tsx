import React, { useState } from 'react';

interface AddIngredientProps {
    onAdd: (ingredientName: string, quantity?: string) => Promise<void>;
    loading?: boolean;
}

/**
 * Component for adding ingredients to inventory
 */
export const AddIngredient: React.FC<AddIngredientProps> = ({ onAdd, loading = false }) => {
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!ingredientName.trim()) {
            setError('Ingredient name is required');
            return;
        }

        setIsSubmitting(true);

        try {
            await onAdd(ingredientName.trim(), quantity.trim() || undefined);
            // Clear form on success
            setIngredientName('');
            setQuantity('');
        } catch {
            setError('Failed to add ingredient');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Ingredient</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="ingredient-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ingredient Name *
                    </label>
                    <input
                        id="ingredient-name"
                        type="text"
                        value={ingredientName}
                        onChange={(e) => setIngredientName(e.target.value)}
                        placeholder="e.g., tomatoes, chicken, rice"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading || isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity (optional)
                    </label>
                    <input
                        id="quantity"
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g., 2 lbs, 500g, 1 cup"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading || isSubmitting}
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || isSubmitting || !ingredientName.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Adding...' : 'Add to Inventory'}
                </button>
            </div>
        </form>
    );
};

export default AddIngredient;
