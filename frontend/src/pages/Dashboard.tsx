import { useState } from 'react';
import { Sidebar, RecipeCard, AiRecipeModal } from '../components';
import Generator from './Generator';
import { useRecipeSearch } from '../hooks';
import { Recipe } from '../types/recipe';
import {
    Sparkles,
    Filter,
    Warehouse,
    ArrowRight,
    ChevronDown,
    Heart,
    Clock,
    Utensils,
    Trash2,
    Settings as SettingsIcon
} from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { results, loading, search } = useRecipeSearch();

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
        await search({ query: searchQuery, limit: 6 });
    };

    const handleRecipeClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'generator':
                return <Generator />;
            case 'saved':
                return (
                    <div className="p-8 animate-fadeIn h-full overflow-y-auto bg-background-light">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <Heart className="text-primary fill-primary" />
                                Your Saved Recipes
                            </h2>
                            <p className="text-slate-500">4 recipes saved</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                                    <div className="h-40 bg-background-card flex items-center justify-center">
                                        <Utensils className="w-12 h-12 text-primary opacity-20" />
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-bold text-lg mb-2 text-slate-900">Saved Recipe #{i}</h4>
                                        <div className="flex items-center gap-4 text-slate-400 text-sm">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 30m</span>
                                            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-primary fill-primary" /> Liked</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'pantry':
                return (
                    <div className="p-8 animate-fadeIn h-full overflow-y-auto bg-background-light">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                            <Warehouse className="text-accent" />
                            Smart Pantry
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold mb-4 text-slate-900">In Stock (12)</h3>
                                    <div className="space-y-3">
                                        {['Fresh Salmon', 'Spinach', 'Lemon', 'Garlic', 'Olive Oil', 'Paprika'].map(item => (
                                            <div key={item} className="flex items-center justify-between p-3 rounded-xl hover:bg-background-light transition-colors">
                                                <span className="font-medium text-slate-700">{item}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">In Stock</span>
                                                    <button className="text-slate-300 hover:text-primary transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl shadow-sm">
                                    <h3 className="font-bold text-accent mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-accent" /> Expedited AI
                                    </h3>
                                    <p className="text-sm text-slate-600">Your salmon is expiring in 2 days. AI suggests making the "Zesty Lemon Salmon" today!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-8 animate-fadeIn h-full overflow-y-auto bg-background-light">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                            <SettingsIcon className="text-slate-500" />
                            Account Settings
                        </h2>
                        <div className="max-w-2xl space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Meal Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">AI Suggestion Sensitivity</span>
                                            <input type="range" className="accent-primary" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600">Metric Units (kg, g)</span>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" defaultChecked />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Danger Zone</h3>
                                    <button className="px-6 py-2 border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors">
                                        Delete Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="flex-1 overflow-y-auto scroll-smooth bg-background-light">
                        {/* Hero Search Section */}
                        <section className="relative px-8 pt-12 pb-16 flex flex-col items-center justify-center text-center">
                            <div className="max-w-3xl w-full space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                        Magic Kitchen <span className="text-primary">Assistant</span>
                                    </h2>
                                    <p className="text-slate-500 text-lg">Type your ingredients and let AI craft the perfect meal.</p>
                                </div>

                                {/* Search Bar */}
                                <form onSubmit={handleSearch} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden p-2 border border-white">
                                        <div className="pl-4 pr-2 text-primary">
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 text-lg py-4 placeholder:text-slate-400 text-slate-800 outline-none"
                                            placeholder="What’s in your fridge? (e.g., Salmon, spinach, and a lemon)"
                                            type="text"
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <span>{loading ? 'Searching...' : 'Explore'}</span>
                                            {!loading && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </form>

                                {/* Trending Chips */}
                                <div className="flex flex-wrap justify-center gap-2 pt-2">
                                    <span className="text-sm font-medium text-slate-400 mr-2">Quick starts:</span>
                                    {['#TofuStirFry', '#PantryPasta', '#AvocadoToast'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => { setSearchQuery(tag.replace('#', '')); handleSearch(); }}
                                            className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-primary hover:text-primary transition-colors italic shadow-sm"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Content Grid Area */}
                        <div className="px-8 pb-12">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Left Sidebar: AI Preferences */}
                                <aside className="lg:col-span-1 space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <h3 className="text-lg font-bold mb-6 text-slate-900 flex items-center gap-2">
                                            <Filter className="text-accent w-5 h-5" />
                                            Preferences
                                        </h3>
                                        <div className="space-y-4">
                                            {['Vegan Only', 'Keto Friendly', 'Gluten-Free'].map(pref => (
                                                <label key={pref} className="flex items-center justify-between cursor-pointer group">
                                                    <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">{pref}</span>
                                                    <div className="relative inline-flex items-center">
                                                        <input className="sr-only peer" type="checkbox" />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <hr className="my-6 border-slate-100" />
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Complexity</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button className="py-2 text-xs font-bold border-2 border-primary bg-primary text-white rounded-lg">Easy</button>
                                                <button className="py-2 text-xs font-bold border-2 border-slate-100 hover:border-primary/50 text-slate-500 rounded-lg">Med</button>
                                                <button className="py-2 text-xs font-bold border-2 border-slate-100 hover:border-primary/50 text-slate-500 rounded-lg">Hard</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Pantry Card */}
                                    <div className="bg-gradient-to-br from-accent to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-accent/20">
                                        <Warehouse className="w-10 h-10 mb-4" />
                                        <h4 className="text-lg font-bold">Your Pantry</h4>
                                        <p className="text-sm opacity-90 mb-4">You have 12 ingredients expiring soon. Check them now!</p>
                                        <button className="w-full bg-white text-accent py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all">Review Pantry</button>
                                    </div>
                                </aside>

                                {/* Right Section: Recipe Grid */}
                                <div className="lg:col-span-3">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {results.length > 0 ? 'Results for you' : 'Suggested for You'}
                                        </h3>
                                        <div className="flex items-center gap-2 cursor-pointer text-slate-500 shadow-sm border border-slate-100 bg-white px-3 py-1.5 rounded-lg">
                                            <span className="text-sm">Sorted by: <span className="font-bold text-slate-900">Best Match</span></span>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {results.map((recipe) => (
                                            <RecipeCard
                                                key={recipe.id}
                                                recipe={recipe}
                                                onClick={() => handleRecipeClick(recipe)}
                                            />
                                        ))}
                                        {results.length === 0 && !loading && (
                                            <p className="col-span-full text-center py-20 text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-100">
                                                Search for something to see magic happen!
                                            </p>
                                        )}
                                    </div>

                                    {/* Pagination/Load More */}
                                    <div className="mt-12 flex flex-col items-center">
                                        <button className="group flex items-center gap-4 text-slate-500 font-bold hover:text-primary transition-colors">
                                            <ChevronDown className="w-6 h-6 animate-bounce" />
                                            <span>Discover more culinary wonders</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light font-body">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {renderContent()}
            </main>

            {selectedRecipe && (
                <AiRecipeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    recipe={selectedRecipe}
                />
            )}
        </div>
    );
}
