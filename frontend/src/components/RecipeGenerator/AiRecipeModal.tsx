import { useState, useEffect } from 'react';
import { Recipe } from '../../types/recipe';
import {
    X,
    Sparkles,
    Clock,
    BarChart,
    Utensils,
    Leaf,
    Brain,
    ShoppingBasket,
    ChefHat,
    Share2,
    Printer
} from 'lucide-react';

interface AiRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe;
}

export default function AiRecipeModal({ isOpen, onClose, recipe }: AiRecipeModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsRendered(true), 0);
            // Use requestAnimationFrame to ensure the render has happened before starting the transition
            const frame = requestAnimationFrame(() => {
                setIsVisible(true);
            });
            return () => cancelAnimationFrame(frame);
        } else {
            setTimeout(() => setIsVisible(false), 0);
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isRendered) return null;

    // Use a placeholder image if none exists
    const placeholderImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDS-t4Vnik5wjq9v7ZgbBmxx3C2Hb1q2rmSJU3B5FTg7qMxK0dIpSaHpZTTInkvqvfqN4VRgWop9chI9gEN5vipxnMYas3ox2OdlrwP7n1QiW19NxldDxoSJusRdLMk1biW2YhGfxvzF2fwr4RDhHKkjC_TXlFeaMmUJiYv5k6I9ZfkMxMrx70f4ioKbTtUKdXASxbq_WbdRRpB2mKDq4Z0SHXADi9q-6d1-OZiNmZ9YrXPfTBOpK-MOdtu6AgBsUtY9RNlGniePao";

    // Convert difficulty
    const difficultyText = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-all duration-300 font-display ${isVisible ? 'opacity-100 backdrop-blur-sm bg-black/60' : 'opacity-0 bg-transparent'}`}
            onClick={onClose}
        >
            <div
                className={`bg-bg dark:bg-bg-dark w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[60] bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full p-2.5 transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto modal-scrollbar">
                    {/* Hero Image Section */}
                    <div className="relative h-64 md:h-96 w-full overflow-hidden group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${placeholderImage}')`
                            }}
                        />
                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-10 animate-fadeIn" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-primary/30">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI Generated
                                </span>
                                {recipe.cuisine_type && (
                                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        {recipe.cuisine_type}
                                    </span>
                                )}
                            </div>
                            <h1 id="modal-title" className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-3xl drop-shadow-md">
                                {recipe.title}
                            </h1>
                        </div>
                    </div>

                    {/* Recipe Content Grid */}
                    <div className="p-6 md:p-10 bg-gradient-to-b from-bg to-bg-card">
                        {/* Metadata Bar */}
                        <div className="flex flex-wrap gap-4 pb-8 border-b border-slate-200/50 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Time</p>
                                    <p className="text-slate-900 font-bold text-sm">{recipe.cooking_time_minutes} Mins</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                    <BarChart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Difficulty</p>
                                    <p className="text-slate-900 font-bold text-sm">{difficultyText}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-accent/20 p-2 rounded-lg text-orange-500">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Servings</p>
                                    <p className="text-slate-900 font-bold text-sm">{recipe.servings} People</p>
                                </div>
                            </div>
                            {recipe.dietary_tags.length > 0 && (
                                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                                        <Leaf className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Dietary</p>
                                        <p className="text-slate-900 font-bold text-sm truncate max-w-[120px]">
                                            {recipe.dietary_tags[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            {recipe.dietary_tags.length > 1 && ` +${recipe.dietary_tags.length - 1}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Reasoning Box */}
                        <div className="mt-8 bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 p-6 rounded-2xl animate-fadeIn hover:border-primary/40 transition-colors duration-300" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                            <div className="flex items-start gap-5">
                                <div className="bg-gradient-to-r from-primary to-accent text-white p-3 rounded-xl shadow-md shadow-primary/20 flex-shrink-0">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-primary font-bold text-xl mb-2 flex items-center gap-2">
                                        Why AI Recommended This
                                    </h3>
                                    <p className="text-text-primary leading-relaxed">
                                        {recipe.description || "Based on the ingredients you provided, this dish provides a perfect nutritional balance and flavor profile. It creatively combines your available items into a cohesive and delicious meal."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Recipe Grid */}
                        <div className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-12 lg:gap-16">
                            {/* Left: Ingredients */}
                            <div className="xl:col-span-1 animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                                <div className="sticky top-6">
                                    <h3 className="text-slate-900 text-2xl font-bold mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                            <ShoppingBasket className="w-5 h-5" />
                                        </div>
                                        Ingredients
                                    </h3>
                                    <ul className="space-y-3 relative before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-gray-200">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all cursor-pointer group relative z-10"
                                            >
                                                <div className="w-10 h-10 bg-slate-50 group-hover:bg-primary/10 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 transition-colors z-10">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors"></div>
                                                </div>
                                                <span className="text-slate-600 text-base group-hover:text-slate-900 transition-colors">
                                                    <strong className="text-slate-900 mr-1">
                                                        {ingredient.quantity} {ingredient.unit}
                                                    </strong>
                                                    <span className="capitalize">{ingredient.name}</span>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Right: Instructions */}
                            <div className="xl:col-span-2 animate-fadeIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                                <h3 className="text-slate-900 text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <ChefHat className="w-5 h-5" />
                                    </div>
                                    Instructions
                                </h3>
                                <div className="space-y-10">
                                    {recipe.instructions.map((instruction, index) => (
                                        <div key={index} className="flex gap-6 group">
                                            <div className="shrink-0 flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm text-secondary font-bold text-lg flex items-center justify-center group-hover:bg-gradient-secondary group-hover:text-white group-hover:border-transparent group-hover:shadow-md transition-all duration-300">
                                                    {index + 1}
                                                </div>
                                                {index !== recipe.instructions.length - 1 && (
                                                    <div className="w-px h-full bg-gray-200 my-2 group-hover:bg-secondary/30 transition-colors duration-300"></div>
                                                )}
                                            </div>
                                            <div className="pb-8 group-hover:-translate-y-1 transition-transform duration-300">
                                                <h4 className="text-slate-900 font-bold text-lg mb-2">Step {index + 1}</h4>
                                                <p className="text-slate-600 leading-relaxed text-base">
                                                    {instruction}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Action Bar */}
                <div className="p-6 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors duration-200 group">
                            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold">Share</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors duration-200 group">
                            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold">Print Recipe</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative group"
                            onClick={onClose}
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></span>
                            <Utensils className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Let's Cook This</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
