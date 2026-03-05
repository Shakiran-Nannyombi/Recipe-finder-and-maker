import { Recipe } from '../../types/recipe';
import { Clock, BarChart, Heart, ArrowRight, Utensils } from 'lucide-react';
import { useState } from 'react';

interface RecipeCardProps {
    recipe: Recipe;
    onClick?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
    const [isSaved, setIsSaved] = useState(false);

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

    const handleSaveToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        // TODO: Add API call to save/unsave recipe
        console.log(isSaved ? 'Unsaved recipe:' : 'Saved recipe:', recipe.title);
    };

    return (
        <div
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer hover:shadow-xl"
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
                    <div className="w-full h-full bg-background-card flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <Utensils className="w-12 h-12 text-primary opacity-20" />
                    </div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5" /> {recipe.cooking_time_minutes}m
                    </span>
                    <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <BarChart className="w-3.5 h-3.5" /> {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h4 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{recipe.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">{recipe.description}</p>

                <div className="flex items-center justify-between gap-3">
                    <button
                        className={`p-3 rounded-xl transition-all group/btn ${isSaved
                                ? 'bg-primary text-white'
                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                            }`}
                        onClick={handleSaveToggle}
                        aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
                    >
                        <Heart
                            className={`w-5 h-5 transition-transform group-hover/btn:scale-110 ${isSaved ? 'fill-current' : ''
                                }`}
                        />
                    </button>
                    <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary transition-all flex items-center gap-2 flex-1 justify-center">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

