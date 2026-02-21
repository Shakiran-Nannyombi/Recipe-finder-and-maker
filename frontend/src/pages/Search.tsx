import { useState } from 'react';
import { SearchBar, RecipeGrid } from '../components';
import { useRecipeSearch } from '../hooks';
import { Recipe } from '../types/recipe';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const { results, loading, error, search, reset } = useRecipeSearch();

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        await search({
            query: searchQuery,
            available_ingredients: selectedIngredients.length > 0 ? selectedIngredients : undefined,
            limit: 10,
        });
    };

    const handleIngredientRemove = (ingredient: string) => {
        setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
    };

    const handleRecipeClick = (recipe: Recipe) => {
        // TODO: Navigate to recipe detail page or show modal
        console.log('Recipe clicked:', recipe);
    };

    const handleReset = () => {
        reset();
        setSearchQuery('');
        setSelectedIngredients([]);
    };

    return (
        <div className="min-h-screen bg-bg py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-heading font-bold text-gradient mb-4">
                        Recipe Search
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Find the perfect recipe using natural language search. Filter by ingredients you have on hand!
                    </p>
                </div>

                {/* Search Section */}
                <div className="card mb-8">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        disabled={loading}
                        selectedIngredients={selectedIngredients}
                        onIngredientRemove={handleIngredientRemove}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-error/10 border-2 border-error rounded-lg p-4 mb-8 animate-fadeIn">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="font-semibold text-error mb-1">Search Error</h3>
                                <p className="text-text-primary">{error}</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                <div>
                    {/* Results Header */}
                    {!loading && results.length > 0 && (
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-heading font-semibold text-text-primary">
                                Search Results
                                <span className="text-text-secondary text-lg ml-2">
                                    ({results.length} {results.length === 1 ? 'recipe' : 'recipes'})
                                </span>
                            </h2>
                            <button
                                onClick={handleReset}
                                className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}

                    {/* Recipe Grid */}
                    <RecipeGrid
                        recipes={results}
                        onRecipeClick={handleRecipeClick}
                        isLoading={loading}
                        emptyMessage={
                            searchQuery
                                ? 'No recipes found. Try adjusting your search query or filters.'
                                : 'Enter a search query to find recipes.'
                        }
                    />
                </div>

                {/* Initial State - Search Tips */}
                {!loading && !error && results.length === 0 && !searchQuery && (
                    <div className="card mt-8 animate-fadeIn">
                        <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                            Search Tips
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-1">Natural Language</h4>
                                    <p className="text-text-secondary text-sm">
                                        Use natural language like "quick pasta dinner" or "healthy breakfast ideas"
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-1">Filter by Ingredients</h4>
                                    <p className="text-text-secondary text-sm">
                                        Add ingredient filters to find recipes you can make with what you have
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-1">Semantic Search</h4>
                                    <p className="text-text-secondary text-sm">
                                        Our AI understands context and finds recipes that match your intent
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-1">Fast Results</h4>
                                    <p className="text-text-secondary text-sm">
                                        Get relevant recipe suggestions in under 2 seconds
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
