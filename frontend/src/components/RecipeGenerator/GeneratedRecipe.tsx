import { Recipe } from '../../types/recipe';

interface GeneratedRecipeProps {
    recipe: Recipe;
    onSave?: () => void;
    isSaving?: boolean;
}

export default function GeneratedRecipe({ recipe, onSave, isSaving = false }: GeneratedRecipeProps) {
    const difficultyColors = {
        easy: 'bg-success text-white',
        medium: 'bg-warning text-white',
        hard: 'bg-error text-white',
    };

    return (
        <div className="card space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-3xl font-heading font-bold text-text-primary mb-2">
                        {recipe.title}
                    </h2>
                    <p className="text-text-secondary">{recipe.description}</p>
                </div>

                {onSave && (
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-text-primary font-medium">{recipe.cooking_time_minutes} mins</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-text-primary font-medium">{recipe.servings} servings</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                    {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                </span>

                {recipe.cuisine_type && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-text-primary">
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
                            className="px-3 py-1 rounded-full text-xs font-medium bg-bg text-text-secondary border border-gray-200"
                        >
                            {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                    ))}
                </div>
            )}

            <div className="border-t border-gray-200 pt-6" />

            {/* Ingredients */}
            <div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recipe.ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-secondary transition-colors duration-200"
                        >
                            <div className="w-2 h-2 rounded-full bg-gradient-primary flex-shrink-0" />
                            <span className="text-text-primary">
                                <span className="font-medium">{ingredient.quantity}</span>
                                {ingredient.unit && <span className="text-text-secondary"> {ingredient.unit}</span>}
                                {' '}
                                <span className="capitalize">{ingredient.name}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6" />

            {/* Instructions */}
            <div>
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Instructions
                </h3>
                <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary text-text-light flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                            </div>
                            <p className="text-text-primary pt-1 flex-1">{instruction}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
