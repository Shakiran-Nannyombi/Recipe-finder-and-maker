import React from 'react';
import { RecipeMatches as RecipeMatchesType, Recipe } from '../../types/recipe';

interface RecipeMatchesProps {
    matches: RecipeMatchesType | null;
    loading?: boolean;
}

/**
 * Component to display matching recipes based on inventory
 */
export const RecipeMatches: React.FC<RecipeMatchesProps> = ({ matches, loading = false }) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Finding matching recipes...</p>
            </div>
        );
    }

    if (!matches) {
        return null;
    }

    const hasMatches = matches.exact_matches.length > 0 || matches.partial_matches.length > 0;

    if (!hasMatches) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No matching recipes found. Try adding more ingredients to your inventory!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Exact Matches */}
            {matches.exact_matches.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Perfect Matches ({matches.exact_matches.length})
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        You have all the ingredients for these recipes!
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {matches.exact_matches.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} isExactMatch={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* Partial Matches */}
            {matches.partial_matches.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Partial Matches ({matches.partial_matches.length})
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        You have most of the ingredients for these recipes.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {matches.partial_matches.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} isExactMatch={false} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Recipe card component for displaying individual recipes
 */
const RecipeCard: React.FC<{ recipe: Recipe; isExactMatch: boolean }> = ({ recipe, isExactMatch }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex-1">{recipe.title}</h4>
                {isExactMatch && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        100%
                    </span>
                )}
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.cooking_time_minutes} min
                </span>
                <span className="capitalize px-2 py-1 bg-gray-100 rounded">
                    {recipe.difficulty}
                </span>
                <span>{recipe.servings} servings</span>
            </div>

            {recipe.dietary_tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {recipe.dietary_tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeMatches;
