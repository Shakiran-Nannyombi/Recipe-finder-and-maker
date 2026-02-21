import { ChangeEvent, FormEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    disabled?: boolean;
    selectedIngredients?: string[];
    onIngredientRemove?: (ingredient: string) => void;
}

export default function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = 'Search for recipes...',
    disabled = false,
    selectedIngredients = [],
    onIngredientRemove,
}: SearchBarProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (value.trim()) {
                onSearch();
            }
        }
    };

    const handleRemoveIngredient = (ingredient: string) => {
        if (onIngredientRemove) {
            onIngredientRemove(ingredient);
        }
    };

    return (
        <div className="w-full space-y-4">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={value}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="input w-full"
                            aria-label="Recipe search input"
                        />
                        {/* Search Icon */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={disabled || !value.trim()}
                        className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        aria-label="Search recipes"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Ingredient Filter Chips */}
            {selectedIngredients.length > 0 && (
                <div className="animate-fadeIn">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-text-secondary">
                            Filters:
                        </span>
                        {selectedIngredients.map((ingredient) => (
                            <div
                                key={ingredient}
                                className="flex items-center gap-2 bg-gradient-accent px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn"
                            >
                                <span className="text-sm font-medium text-text-primary capitalize">
                                    {ingredient}
                                </span>
                                {onIngredientRemove && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(ingredient)}
                                        className="text-error hover:text-error/80 transition-colors duration-200 font-bold text-lg leading-none hover:scale-110"
                                        aria-label={`Remove ${ingredient} filter`}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
