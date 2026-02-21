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



    return (
        <div
            className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden recipe-card-shadow border border-slate-100 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-md hover:shadow-xl"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View recipe: ${recipe.title}`}
        >
            <div className="relative h-56 overflow-hidden">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-accent flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <span className="material-symbols-outlined text-5xl text-white/50">restaurant</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-sm">schedule</span> {recipe.cooking_time_minutes}m
                    </span>
                    <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-sm">stairs</span> {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{recipe.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 h-10">{recipe.description}</p>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-3 rounded-xl transition-all group/btn"
                        onClick={(e) => { e.stopPropagation(); /* TODO: Save logic */ }}
                    >
                        <span className="material-symbols-outlined block">favorite</span>
                    </button>
                    <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all flex items-center gap-2">
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
