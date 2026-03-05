import { useState } from 'react';
import { Heart, Clock, Utensils, Search, Filter, Trash2, ChevronDown, Star } from 'lucide-react';
import { Recipe } from '../types/recipe';

export default function SavedRecipes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'favorites'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'time'>('date');

    // Demo saved recipes
    const [savedRecipes] = useState<Recipe[]>([
        {
            id: '1',
            title: 'Grilled Salmon with Lemon Butter',
            description: 'A delicious and healthy grilled salmon with a zesty lemon butter sauce.',
            image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
            cooking_time_minutes: 25,
            servings: 4,
            difficulty: 'easy',
            cuisine_type: 'Mediterranean',
            dietary_tags: ['gluten-free', 'pescatarian'],
            ingredients: [
                { name: 'Salmon fillet', quantity: '4', unit: 'pieces' },
                { name: 'Lemon', quantity: '2', unit: 'whole' }
            ],
            instructions: ['Preheat grill', 'Season salmon', 'Grill for 4-5 minutes per side'],
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Thai Green Curry',
            description: 'Aromatic Thai green curry packed with fresh vegetables.',
            image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
            cooking_time_minutes: 30,
            servings: 4,
            difficulty: 'medium',
            cuisine_type: 'Thai',
            dietary_tags: ['vegan', 'vegetarian'],
            ingredients: [
                { name: 'Green curry paste', quantity: '3', unit: 'tbsp' },
                { name: 'Coconut milk', quantity: '400', unit: 'ml' }
            ],
            instructions: ['Heat curry paste', 'Add coconut milk', 'Simmer'],
            created_at: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Mediterranean Quinoa Bowl',
            description: 'Nutritious quinoa bowl loaded with fresh vegetables and feta cheese.',
            image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
            cooking_time_minutes: 20,
            servings: 2,
            difficulty: 'easy',
            cuisine_type: 'Mediterranean',
            dietary_tags: ['vegetarian', 'gluten-free'],
            ingredients: [
                { name: 'Quinoa', quantity: '1', unit: 'cup' },
                { name: 'Feta cheese', quantity: '100', unit: 'g' }
            ],
            instructions: ['Cook quinoa', 'Chop vegetables', 'Mix and dress'],
            created_at: new Date().toISOString()
        },
        {
            id: '4',
            title: 'Keto Avocado Egg Boats',
            description: 'Simple keto breakfast with baked eggs in avocado halves.',
            image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
            cooking_time_minutes: 15,
            servings: 2,
            difficulty: 'easy',
            cuisine_type: 'American',
            dietary_tags: ['keto', 'low-carb', 'gluten-free'],
            ingredients: [
                { name: 'Avocados', quantity: '2', unit: 'whole' },
                { name: 'Eggs', quantity: '4', unit: 'whole' }
            ],
            instructions: ['Halve avocados', 'Crack egg into each', 'Bake until set'],
            created_at: new Date().toISOString()
        }
    ]);

    const filteredRecipes = savedRecipes
        .filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'time':
                    return a.cooking_time_minutes - b.cooking_time_minutes;
                case 'date':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

    const handleRemove = (id: string) => {
        console.log('Remove recipe:', id);
        // TODO: Implement remove functionality
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 pt-16 md:pt-0">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-orange-50 to-white px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Heart className="w-10 h-10 text-orange-500 fill-orange-500" />
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Saved Recipes</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-orange-500">{savedRecipes.length}</p>
                            <p className="text-sm text-slate-600">recipes saved</p>
                        </div>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg mb-8">Your favorite recipes, all in one place</p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your saved recipes..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Filters and Sort */}
            <div className="px-4 md:px-8 py-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilterBy('all')}
                            className={`px-6 py-2 rounded-xl font-medium transition-all ${filterBy === 'all'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterBy('recent')}
                            className={`px-6 py-2 rounded-xl font-medium transition-all ${filterBy === 'recent'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            Recent
                        </button>
                        <button
                            onClick={() => setFilterBy('favorites')}
                            className={`px-6 py-2 rounded-xl font-medium transition-all ${filterBy === 'favorites'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            Favorites
                        </button>
                    </div>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="appearance-none cursor-pointer text-slate-600 bg-white px-4 py-2 pr-10 rounded-xl border border-slate-200 hover:border-orange-500 transition-colors outline-none"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="time">Sort by Time</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <div className="px-4 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {filteredRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRecipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={recipe.image_url}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <button
                                            onClick={() => handleRemove(recipe.id)}
                                            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex gap-2">
                                                {recipe.dietary_tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-white/95 backdrop-blur-sm text-xs font-medium rounded-full text-slate-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">{recipe.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {recipe.cooking_time_minutes}m
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Utensils className="w-4 h-4" />
                                                {recipe.servings} servings
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'easy'
                                                ? 'bg-green-100 text-green-700'
                                                : recipe.difficulty === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>

                                        <button className="w-full bg-slate-900 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all">
                                            View Recipe
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">No saved recipes found</p>
                            <p className="text-slate-400 text-sm mt-2">Start saving recipes to see them here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
