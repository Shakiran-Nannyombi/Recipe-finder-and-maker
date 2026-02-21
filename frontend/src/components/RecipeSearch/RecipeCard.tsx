import { Recipe } from '../../types/recipe';

interface RecipeCardProps {
    recipe: Recipe;
    onClick?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(recipe);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'text-green-600 bg-green-50';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50';
            case 'hard':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div
            className="card group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View recipe: ${recipe.title}`}
        >
            {/* Recipe Image */}
            <div className="relative w-full h-48 bg-gradient-accent rounded-t-lg overflow-hidden">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-text-secondary opacity-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Recipe Content */}
            <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {recipe.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary line-clamp-3">
                    {recipe.description}
                </p>

                {/* Recipe Metadata */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    {/* Cooking Time */}
                    <div className="flex items-center gap-1.5 text-text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-sm font-medium">
                            {recipe.cooking_time_minutes} min
                        </span>
                    </div>

                    {/* Difficulty Badge */}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(
                            recipe.difficulty
                        )}`}
                    >
                        {recipe.difficulty}
                    </span>

                    {/* Servings */}
                    <div className="flex items-center gap-1.5 text-text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="text-sm font-medium">
                            {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
                        </span>
                    </div>
                </div>

                {/* Dietary Tags */}
                {recipe.dietary_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {recipe.dietary_tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded capitalize"
                            >
                                {tag}
                            </span>
                        ))}
                        {recipe.dietary_tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                +{recipe.dietary_tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
