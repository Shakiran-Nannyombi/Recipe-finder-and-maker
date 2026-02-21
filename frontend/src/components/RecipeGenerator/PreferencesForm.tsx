import { useState } from 'react';

export interface RecipePreferences {
    dietaryRestrictions: string[];
    cuisineType: string;
    difficulty: string;
}

interface PreferencesFormProps {
    preferences: RecipePreferences;
    onChange: (preferences: RecipePreferences) => void;
}

const dietaryOptions = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'low-carb',
    'keto',
    'paleo',
];

const cuisineTypes = [
    { value: '', label: 'Any Cuisine' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'indian', label: 'Indian' },
    { value: 'thai', label: 'Thai' },
    { value: 'french', label: 'French' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'american', label: 'American' },
    { value: 'korean', label: 'Korean' },
];

const difficultyLevels = [
    { value: '', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy', description: 'Quick and simple' },
    { value: 'medium', label: 'Medium', description: 'Moderate skill' },
    { value: 'hard', label: 'Hard', description: 'Advanced techniques' },
];

export default function PreferencesForm({ preferences, onChange }: PreferencesFormProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDietaryChange = (restriction: string) => {
        const newRestrictions = preferences.dietaryRestrictions.includes(restriction)
            ? preferences.dietaryRestrictions.filter(r => r !== restriction)
            : [...preferences.dietaryRestrictions, restriction];

        onChange({
            ...preferences,
            dietaryRestrictions: newRestrictions,
        });
    };

    const handleCuisineChange = (cuisine: string) => {
        onChange({
            ...preferences,
            cuisineType: cuisine,
        });
    };

    const handleDifficultyChange = (difficulty: string) => {
        onChange({
            ...preferences,
            difficulty,
        });
    };

    const hasPreferences =
        preferences.dietaryRestrictions.length > 0 ||
        preferences.cuisineType ||
        preferences.difficulty;

    return (
        <div className="card">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left"
                aria-expanded={isExpanded}
            >
                <div>
                    <h3 className="text-lg font-heading font-semibold text-text-primary">
                        Recipe Preferences
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                        {hasPreferences
                            ? 'Customize your recipe generation'
                            : 'Optional - Click to customize'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {hasPreferences && (
                        <span className="bg-accent text-text-primary text-xs px-2 py-1 rounded-full">
                            {preferences.dietaryRestrictions.length +
                                (preferences.cuisineType ? 1 : 0) +
                                (preferences.difficulty ? 1 : 0)} active
                        </span>
                    )}
                    <svg
                        className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isExpanded && (
                <div className="mt-6 space-y-6 animate-fadeIn">
                    {/* Dietary Restrictions */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-3">
                            Dietary Restrictions
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {dietaryOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleDietaryChange(option)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${preferences.dietaryRestrictions.includes(option)
                                            ? 'bg-gradient-primary text-text-light shadow-md'
                                            : 'bg-white border-2 border-gray-200 text-text-primary hover:border-secondary'
                                        }`}
                                    aria-pressed={preferences.dietaryRestrictions.includes(option)}
                                >
                                    {option.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cuisine Type */}
                    <div>
                        <label htmlFor="cuisine-select" className="block text-sm font-medium text-text-primary mb-3">
                            Cuisine Type
                        </label>
                        <select
                            id="cuisine-select"
                            value={preferences.cuisineType}
                            onChange={(e) => handleCuisineChange(e.target.value)}
                            className="input cursor-pointer"
                        >
                            {cuisineTypes.map((cuisine) => (
                                <option key={cuisine.value} value={cuisine.value}>
                                    {cuisine.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-3">
                            Difficulty Level
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {difficultyLevels.map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => handleDifficultyChange(level.value)}
                                    className={`p-4 rounded-lg text-left transition-all duration-200 ${preferences.difficulty === level.value
                                            ? 'bg-gradient-primary text-text-light shadow-md'
                                            : 'bg-white border-2 border-gray-200 hover:border-secondary'
                                        }`}
                                    aria-pressed={preferences.difficulty === level.value}
                                >
                                    <div className="font-medium">{level.label}</div>
                                    {level.description && (
                                        <div className={`text-sm mt-1 ${preferences.difficulty === level.value
                                                ? 'text-text-light/80'
                                                : 'text-text-secondary'
                                            }`}>
                                            {level.description}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear All Button */}
                    {hasPreferences && (
                        <button
                            onClick={() => onChange({
                                dietaryRestrictions: [],
                                cuisineType: '',
                                difficulty: '',
                            })}
                            className="text-sm text-error hover:text-error/80 transition-colors duration-200"
                        >
                            Clear all preferences
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
