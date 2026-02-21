import { useState } from 'react';
import { IngredientInput, PreferencesForm, GeneratedRecipe, RecipePreferences } from '../components';
import { useRecipeGenerator } from '../hooks';

export default function Generator() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [preferences, setPreferences] = useState<RecipePreferences>({
        dietaryRestrictions: [],
        cuisineType: '',
        difficulty: '',
    });

    const { recipe, loading, error, success, generateRecipe, reset } = useRecipeGenerator();

    const handleAddIngredient = (ingredient: string) => {
        setIngredients([...ingredients, ingredient]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleGenerate = async () => {
        await generateRecipe({
            ingredients,
            dietary_restrictions: preferences.dietaryRestrictions,
            cuisine_type: preferences.cuisineType || undefined,
            difficulty: preferences.difficulty || undefined,
        });
    };

    const handleReset = () => {
        reset();
        setIngredients([]);
        setPreferences({
            dietaryRestrictions: [],
            cuisineType: '',
            difficulty: '',
        });
    };

    const canGenerate = ingredients.length > 0 && !loading;

    return (
        <div className="min-h-screen bg-bg py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-heading font-bold text-gradient mb-4">
                        AI Recipe Generator
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Tell us what ingredients you have, and our AI will create a delicious recipe just for you!
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input Section */}
                    <div className="space-y-6">
                        {/* Ingredient Input */}
                        <div className="card">
                            <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                                Your Ingredients
                            </h2>
                            <IngredientInput
                                ingredients={ingredients}
                                onAdd={handleAddIngredient}
                                onRemove={handleRemoveIngredient}
                            />
                        </div>

                        {/* Preferences Form */}
                        <PreferencesForm
                            preferences={preferences}
                            onChange={setPreferences}
                        />

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg py-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Generating Your Recipe...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Generate Recipe
                                </span>
                            )}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-error/10 border-2 border-error rounded-lg p-4 animate-fadeIn">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-error mb-1">Error</h3>
                                        <p className="text-text-primary">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Result Section */}
                    <div className="space-y-6">
                        {loading && (
                            <div className="card flex flex-col items-center justify-center py-16 animate-fadeIn">
                                <div className="relative">
                                    <div className="w-24 h-24 border-8 border-bg rounded-full"></div>
                                    <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                </div>
                                <p className="text-text-secondary mt-6 text-lg">
                                    Creating your perfect recipe...
                                </p>
                                <p className="text-text-secondary text-sm mt-2">
                                    This may take a few seconds
                                </p>
                            </div>
                        )}

                        {success && recipe && (
                            <div className="animate-fadeIn">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-heading font-semibold text-text-primary">
                                        Your Recipe
                                    </h2>
                                    <button
                                        onClick={handleReset}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                                    >
                                        Generate Another
                                    </button>
                                </div>
                                <GeneratedRecipe recipe={recipe} />
                            </div>
                        )}

                        {!loading && !success && !error && (
                            <div className="card flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                                    Ready to Cook?
                                </h3>
                                <p className="text-text-secondary max-w-sm">
                                    Add your ingredients and click "Generate Recipe" to get started!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
