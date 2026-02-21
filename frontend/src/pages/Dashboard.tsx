import { useState } from 'react';
import { Sidebar, RecipeCard, AiRecipeModal } from '../components';
import Generator from './Generator';
import { useRecipeSearch } from '../hooks';
import { Recipe } from '../types/recipe';

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
            case 'dashboard':
            default:
                return (
                    <div className="flex-1 overflow-y-auto scroll-smooth bg-background-light dark:bg-background-dark">
                        {/* Hero Search Section */}
                        <section className="relative px-8 pt-12 pb-16 flex flex-col items-center justify-center text-center">
                            <div className="max-w-3xl w-full space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                                        Magic Kitchen <span className="text-primary">Assistant</span>
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Type your ingredients and let AI craft the perfect meal.</p>
                                </div>

                                {/* Search Bar */}
                                <form onSubmit={handleSearch} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden p-2 border border-white dark:border-zinc-800">
                                        <div className="pl-4 pr-2 text-primary">
                                            <span className="material-symbols-outlined text-3xl">flare</span>
                                        </div>
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 text-lg py-4 placeholder:text-slate-400 dark:text-white outline-none"
                                            placeholder="What’s in your fridge? (e.g., Salmon, spinach, and a lemon)"
                                            type="text"
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <span>{loading ? 'Searching...' : 'Explore'}</span>
                                            {!loading && <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>}
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
                                            className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors italic"
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
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-accent">tune</span>
                                            Preferences
                                        </h3>
                                        <div className="space-y-4">
                                            {['Vegan Only', 'Keto Friendly', 'Gluten-Free'].map(pref => (
                                                <label key={pref} className="flex items-center justify-between cursor-pointer group">
                                                    <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">{pref}</span>
                                                    <div className="relative inline-flex items-center">
                                                        <input className="sr-only peer" type="checkbox" />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <hr className="my-6 border-slate-100 dark:border-zinc-800" />
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Complexity</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button className="py-2 text-xs font-bold border-2 border-primary bg-primary text-white rounded-lg">Easy</button>
                                                <button className="py-2 text-xs font-bold border-2 border-slate-100 dark:border-zinc-800 hover:border-primary/50 rounded-lg">Med</button>
                                                <button className="py-2 text-xs font-bold border-2 border-slate-100 dark:border-zinc-800 hover:border-primary/50 rounded-lg">Hard</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Pantry Card */}
                                    <div className="bg-gradient-to-br from-accent to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-accent/20">
                                        <span className="material-symbols-outlined text-4xl mb-4">inventory_2</span>
                                        <h4 className="text-lg font-bold">Your Pantry</h4>
                                        <p className="text-sm opacity-90 mb-4">You have 12 ingredients expiring soon. Check them now!</p>
                                        <button className="w-full bg-white text-accent py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all">Review Pantry</button>
                                    </div>
                                </aside>

                                {/* Right Section: Recipe Grid */}
                                <div className="lg:col-span-3">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {results.length > 0 ? 'Results for you' : 'Suggested for You'}
                                        </h3>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <span className="text-sm text-slate-500">Sorted by: <span className="font-bold text-slate-900 dark:text-white">Best Match</span></span>
                                            <span className="material-symbols-outlined text-sm">expand_more</span>
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
                                            <p className="col-span-full text-center py-12 text-slate-400">Search for something to see magic happen!</p>
                                        )}
                                    </div>

                                    {/* Pagination/Load More */}
                                    <div className="mt-12 flex flex-col items-center">
                                        <button className="group flex items-center gap-4 text-slate-500 dark:text-slate-400 font-bold hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined animate-bounce">expand_circle_down</span>
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
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display">
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
