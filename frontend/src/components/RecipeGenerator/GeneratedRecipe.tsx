import { useState } from 'react';
import { Recipe } from '../../types/recipe';
import AiRecipeModal from './AiRecipeModal';

interface GeneratedRecipeProps {
    recipe: Recipe;
    onSave?: () => void;
    isSaving?: boolean;
}

export default function GeneratedRecipe({ recipe, onSave, isSaving = false }: GeneratedRecipeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const difficultyColors = {
        easy: 'bg-green-500 text-white',
        medium: 'bg-yellow-500 text-white',
        hard: 'bg-red-500 text-white',
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-3xl font-bold text-slate-900">
                            {recipe.title}
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-orange-500 hover:text-orange-600 transition-colors p-1"
                            title="View AI Details"
                        >
                            <span className="material-symbols-outlined text-2xl">info</span>
                        </button>
                    </div>

                    <p className="text-slate-600">{recipe.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                    {onSave && (
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            aria-label="Save recipe"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Recipe
                                </>
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        AI Insights
                    </button>
                </div>
            </div>

            {/* Modal */}
            <AiRecipeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                recipe={recipe}
            />

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-900 font-medium">{recipe.cooking_time_minutes} mins</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-slate-900 font-medium">{recipe.servings} servings</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                    {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                </span>

                {recipe.cuisine_type && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {recipe.cuisine_type.charAt(0).toUpperCase() + recipe.cuisine_type.slice(1)}
                    </span>
                )}
            </div>

            {/* Dietary Tags */}
            {recipe.dietary_tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {recipe.dietary_tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200"
                        >
                            {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                    ))}
                </div>
            )}

            <div className="border-t border-slate-200 pt-6" />

            {/* Ingredients */}
            <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recipe.ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-orange-500 transition-colors duration-200"
                        >
                            <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                            <span className="text-slate-900">
                                <span className="font-medium">{ingredient.quantity}</span>
                                {ingredient.unit && <span className="text-slate-600"> {ingredient.unit}</span>}
                                {' '}
                                <span className="capitalize">{ingredient.name}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-200 pt-6" />

            {/* Instructions */}
            <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Instructions
                </h3>
                <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                            </div>
                            <p className="text-slate-900 pt-1 flex-1">{instruction}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
