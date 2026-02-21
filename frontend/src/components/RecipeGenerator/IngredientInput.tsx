import { useState, KeyboardEvent } from 'react';

interface IngredientInputProps {
    ingredients: string[];
    onAdd: (ingredient: string) => void;
    onRemove: (index: number) => void;
}

const commonIngredients = [
    'chicken', 'beef', 'pork', 'fish', 'shrimp',
    'rice', 'pasta', 'potatoes', 'tomatoes', 'onions',
    'garlic', 'carrots', 'broccoli', 'spinach', 'mushrooms',
    'cheese', 'milk', 'eggs', 'butter', 'olive oil',
];

export default function IngredientInput({ ingredients, onAdd, onRemove }: IngredientInputProps) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleInputChange = (value: string) => {
        setInput(value);

        if (value.trim().length > 0) {
            const filtered = commonIngredients.filter(
                ingredient =>
                    ingredient.toLowerCase().includes(value.toLowerCase()) &&
                    !ingredients.includes(ingredient)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleAdd = (ingredient?: string) => {
        const ingredientToAdd = ingredient || input.trim();

        if (ingredientToAdd && !ingredients.includes(ingredientToAdd.toLowerCase())) {
            onAdd(ingredientToAdd.toLowerCase());
            setInput('');
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        handleAdd(suggestion);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <label htmlFor="ingredient-input" className="block text-sm font-medium text-text-secondary mb-2">
                    Add Ingredients
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            id="ingredient-input"
                            type="text"
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => input.trim() && setShowSuggestions(filteredSuggestions.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="e.g., chicken, tomatoes, rice..."
                            className="input"
                            aria-label="Ingredient input"
                        />

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-4 py-2 hover:bg-bg-card transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => handleAdd()}
                        disabled={!input.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        aria-label="Add ingredient"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Ingredient List */}
            {ingredients.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-text-secondary">
                        Your Ingredients ({ingredients.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-bg-card px-4 py-2 rounded-full border border-secondary/20 hover:border-secondary transition-colors duration-200"
                            >
                                <span className="text-text-primary capitalize">{ingredient}</span>
                                <button
                                    onClick={() => onRemove(index)}
                                    className="text-error hover:text-error/80 transition-colors duration-200 font-bold"
                                    aria-label={`Remove ${ingredient}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {ingredients.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                    <p className="text-sm">No ingredients added yet. Start by adding some ingredients above!</p>
                </div>
            )}
        </div>
    );
}
