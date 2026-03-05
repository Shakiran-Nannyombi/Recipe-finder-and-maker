import { useState } from 'react';
import { Sidebar, RecipeCard, AiRecipeModal } from '../components';
import Generator from './Generator';
import Cookbooks from './Cookbooks';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sortBy, setSortBy] = useState<'best-match' | 'rating' | 'time' | 'difficulty'>('best-match');

    // Filter states
    const [isVeganOnly, setIsVeganOnly] = useState(false);
    const [isKetoFriendly, setIsKetoFriendly] = useState(false);
    const [isGlutenFree, setIsGlutenFree] = useState(false);
    const [complexity, setComplexity] = useState<'easy' | 'medium' | 'hard'>('easy');

    const { results, loading, search } = useRecipeSearch();

    // Demo recipes to show by default
    const demoRecipes: Recipe[] = [
        {
            id: '1',
            title: 'Grilled Salmon with Lemon Butter',
            description: 'A delicious and healthy grilled salmon with a zesty lemon butter sauce, perfect for a quick weeknight dinner.',
            image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
            cooking_time_minutes: 25,
            servings: 4,
            difficulty: 'easy',
            cuisine_type: 'Mediterranean',
            dietary_tags: ['gluten-free', 'pescatarian', 'high-protein'],
            ingredients: [
                { name: 'Salmon fillet', quantity: '4', unit: 'pieces' },
                { name: 'Lemon', quantity: '2', unit: 'whole' },
                { name: 'Butter', quantity: '3', unit: 'tbsp' }
            ],
            instructions: ['Preheat grill to medium-high', 'Season salmon with salt and pepper', 'Grill for 4-5 minutes per side'],
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Thai Green Curry with Vegetables',
            description: 'Aromatic Thai green curry packed with fresh vegetables and creamy coconut milk for a flavorful vegan meal.',
            image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
            cooking_time_minutes: 30,
            servings: 4,
            difficulty: 'medium',
            cuisine_type: 'Thai',
            dietary_tags: ['vegan', 'vegetarian', 'dairy-free', 'gluten-free'],
            ingredients: [
                { name: 'Green curry paste', quantity: '3', unit: 'tbsp' },
                { name: 'Coconut milk', quantity: '400', unit: 'ml' },
                { name: 'Mixed vegetables', quantity: '500', unit: 'g' }
            ],
            instructions: ['Heat curry paste in pan', 'Add coconut milk and vegetables', 'Simmer for 15 minutes'],
            created_at: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Mediterranean Quinoa Bowl',
            description: 'Nutritious quinoa bowl loaded with fresh vegetables, feta cheese, and a light olive oil dressing.',
            image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
            cooking_time_minutes: 20,
            servings: 2,
            difficulty: 'easy',
            cuisine_type: 'Mediterranean',
            dietary_tags: ['vegetarian', 'gluten-free', 'healthy'],
            ingredients: [
                { name: 'Quinoa', quantity: '1', unit: 'cup' },
                { name: 'Cherry tomatoes', quantity: '200', unit: 'g' },
                { name: 'Feta cheese', quantity: '100', unit: 'g' }
            ],
            instructions: ['Cook quinoa according to package', 'Chop vegetables', 'Mix all ingredients and dress with olive oil'],
            created_at: new Date().toISOString()
        },
        {
            id: '4',
            title: 'Japanese Teriyaki Chicken',
            description: 'Tender chicken glazed with homemade teriyaki sauce, served with steamed rice and vegetables.',
            image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
            cooking_time_minutes: 35,
            servings: 4,
            difficulty: 'medium',
            cuisine_type: 'Japanese',
            dietary_tags: ['gluten-free', 'high-protein'],
            ingredients: [
                { name: 'Chicken thighs', quantity: '6', unit: 'pieces' },
                { name: 'Soy sauce', quantity: '4', unit: 'tbsp' },
                { name: 'Mirin', quantity: '2', unit: 'tbsp' }
            ],
            instructions: ['Marinate chicken in teriyaki sauce', 'Pan-fry until golden', 'Serve with rice'],
            created_at: new Date().toISOString()
        },
        {
            id: '5',
            title: 'Mexican Street Tacos',
            description: 'Authentic street-style tacos with seasoned meat, fresh cilantro, lime, and homemade salsa.',
            image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
            cooking_time_minutes: 20,
            servings: 6,
            difficulty: 'easy',
            cuisine_type: 'Mexican',
            dietary_tags: ['dairy-free'],
            ingredients: [
                { name: 'Beef or chicken', quantity: '500', unit: 'g' },
                { name: 'Corn tortillas', quantity: '12', unit: 'pieces' },
                { name: 'Fresh cilantro', quantity: '1', unit: 'bunch' }
            ],
            instructions: ['Season and cook meat', 'Warm tortillas', 'Assemble tacos with toppings'],
            created_at: new Date().toISOString()
        },
        {
            id: '6',
            title: 'Italian Caprese Salad',
            description: 'Classic Italian salad with fresh mozzarella, ripe tomatoes, basil, and balsamic glaze.',
            image_url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
            cooking_time_minutes: 10,
            servings: 4,
            difficulty: 'easy',
            cuisine_type: 'Italian',
            dietary_tags: ['vegetarian', 'gluten-free', 'quick'],
            ingredients: [
                { name: 'Fresh mozzarella', quantity: '250', unit: 'g' },
                { name: 'Tomatoes', quantity: '4', unit: 'large' },
                { name: 'Fresh basil', quantity: '1', unit: 'bunch' }
            ],
            instructions: ['Slice tomatoes and mozzarella', 'Arrange on plate', 'Drizzle with olive oil and balsamic'],
            created_at: new Date().toISOString()
        },
        {
            id: '7',
            title: 'Vegan Buddha Bowl',
            description: 'Colorful and nutritious bowl with roasted chickpeas, quinoa, avocado, and tahini dressing.',
            image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            cooking_time_minutes: 25,
            servings: 2,
            difficulty: 'easy',
            cuisine_type: 'Fusion',
            dietary_tags: ['vegan', 'vegetarian', 'gluten-free', 'healthy'],
            ingredients: [
                { name: 'Chickpeas', quantity: '400', unit: 'g' },
                { name: 'Quinoa', quantity: '1', unit: 'cup' },
                { name: 'Avocado', quantity: '1', unit: 'whole' }
            ],
            instructions: ['Roast chickpeas with spices', 'Cook quinoa', 'Assemble bowl with vegetables and dressing'],
            created_at: new Date().toISOString()
        },
        {
            id: '8',
            title: 'Keto Cauliflower Pizza',
            description: 'Low-carb pizza with cauliflower crust, topped with cheese, vegetables, and your favorite toppings.',
            image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
            cooking_time_minutes: 40,
            servings: 4,
            difficulty: 'medium',
            cuisine_type: 'Italian',
            dietary_tags: ['keto', 'low-carb', 'gluten-free', 'vegetarian'],
            ingredients: [
                { name: 'Cauliflower', quantity: '1', unit: 'head' },
                { name: 'Mozzarella cheese', quantity: '200', unit: 'g' },
                { name: 'Eggs', quantity: '2', unit: 'whole' }
            ],
            instructions: ['Make cauliflower crust', 'Bake crust until golden', 'Add toppings and bake again'],
            created_at: new Date().toISOString()
        },
        {
            id: '9',
            title: 'Spicy Korean Bibimbap',
            description: 'Traditional Korean rice bowl with seasoned vegetables, egg, and spicy gochujang sauce.',
            image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&q=80',
            cooking_time_minutes: 45,
            servings: 4,
            difficulty: 'hard',
            cuisine_type: 'Korean',
            dietary_tags: ['gluten-free', 'high-protein'],
            ingredients: [
                { name: 'Rice', quantity: '2', unit: 'cups' },
                { name: 'Mixed vegetables', quantity: '400', unit: 'g' },
                { name: 'Beef', quantity: '300', unit: 'g' }
            ],
            instructions: ['Cook rice', 'Prepare and season vegetables', 'Assemble bowl with egg and sauce'],
            created_at: new Date().toISOString()
        },
        {
            id: '10',
            title: 'Vegan Lentil Curry',
            description: 'Hearty and flavorful lentil curry with aromatic spices, coconut milk, and fresh herbs.',
            image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80',
            cooking_time_minutes: 35,
            servings: 6,
            difficulty: 'medium',
            cuisine_type: 'Indian',
            dietary_tags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
            ingredients: [
                { name: 'Red lentils', quantity: '2', unit: 'cups' },
                { name: 'Coconut milk', quantity: '400', unit: 'ml' },
                { name: 'Curry spices', quantity: '3', unit: 'tbsp' }
            ],
            instructions: ['Cook lentils with spices', 'Add coconut milk', 'Simmer until thick'],
            created_at: new Date().toISOString()
        },
        {
            id: '11',
            title: 'Keto Avocado Egg Boats',
            description: 'Simple and delicious keto breakfast with baked eggs in avocado halves, topped with cheese.',
            image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
            cooking_time_minutes: 15,
            servings: 2,
            difficulty: 'easy',
            cuisine_type: 'American',
            dietary_tags: ['keto', 'low-carb', 'gluten-free', 'vegetarian'],
            ingredients: [
                { name: 'Avocados', quantity: '2', unit: 'whole' },
                { name: 'Eggs', quantity: '4', unit: 'whole' },
                { name: 'Cheese', quantity: '50', unit: 'g' }
            ],
            instructions: ['Halve avocados and remove pit', 'Crack egg into each half', 'Bake until egg is set'],
            created_at: new Date().toISOString()
        },
        {
            id: '12',
            title: 'French Coq au Vin',
            description: 'Classic French braised chicken in red wine with mushrooms, bacon, and pearl onions.',
            image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
            cooking_time_minutes: 90,
            servings: 6,
            difficulty: 'hard',
            cuisine_type: 'French',
            dietary_tags: ['gluten-free', 'high-protein'],
            ingredients: [
                { name: 'Chicken pieces', quantity: '1.5', unit: 'kg' },
                { name: 'Red wine', quantity: '750', unit: 'ml' },
                { name: 'Bacon', quantity: '200', unit: 'g' }
            ],
            instructions: ['Brown chicken and bacon', 'Add wine and vegetables', 'Braise for 1 hour'],
            created_at: new Date().toISOString()
        }
    ];

    // Show demo recipes if no search results
    const displayRecipes = results.length > 0 ? results : demoRecipes;

    // Filter recipes based on preferences
    const filteredRecipes = displayRecipes.filter(recipe => {
        // Vegan filter
        if (isVeganOnly && !recipe.dietary_tags.includes('vegan')) {
            return false;
        }

        // Keto filter
        if (isKetoFriendly && !recipe.dietary_tags.includes('keto') && !recipe.dietary_tags.includes('low-carb')) {
            return false;
        }

        // Gluten-free filter
        if (isGlutenFree && !recipe.dietary_tags.includes('gluten-free')) {
            return false;
        }

        // Complexity filter - only apply if no dietary filters are active
        const hasDietaryFilters = isVeganOnly || isKetoFriendly || isGlutenFree;
        if (!hasDietaryFilters && recipe.difficulty !== complexity) {
            return false;
        }

        return true;
    });

    // Sort recipes
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        switch (sortBy) {
            case 'time':
                return a.cooking_time_minutes - b.cooking_time_minutes;
            case 'difficulty':
                const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            case 'best-match':
            default:
                return 0; // Keep original order
        }
    });

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
            case 'cookbooks':
                return <Cookbooks />;
            case 'saved':
                return (
                    <div className="p-4 md:p-8 animate-fadeIn h-full overflow-y-auto bg-background-light pt-20 md:pt-8">
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
                    <div className="p-4 md:p-8 animate-fadeIn h-full overflow-y-auto bg-background-light pt-20 md:pt-8">
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
                    <div className="p-4 md:p-8 animate-fadeIn h-full overflow-y-auto bg-background-light pt-20 md:pt-8">
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
                    <div className="flex-1 overflow-y-auto scroll-smooth bg-background-light pt-16 md:pt-0">
                        {/* Hero Search Section */}
                        <section className="relative px-4 md:px-8 pt-8 md:pt-12 pb-16 flex flex-col items-center justify-center text-center">
                            <div className="max-w-3xl w-full space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                                        Magic Kitchen <span className="text-primary">Assistant</span>
                                    </h2>
                                    <p className="text-slate-500 text-base md:text-lg">Type your ingredients and let AI craft the perfect meal.</p>
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
                                            onClick={async () => {
                                                const query = tag.replace('#', '');
                                                setSearchQuery(query);
                                                await search({ query, limit: 6 });
                                            }}
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
                                            <label className="flex items-center justify-between cursor-pointer group">
                                                <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">Vegan Only</span>
                                                <div className="relative inline-flex items-center">
                                                    <input
                                                        className="sr-only peer"
                                                        type="checkbox"
                                                        checked={isVeganOnly}
                                                        onChange={(e) => setIsVeganOnly(e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer group">
                                                <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">Keto Friendly</span>
                                                <div className="relative inline-flex items-center">
                                                    <input
                                                        className="sr-only peer"
                                                        type="checkbox"
                                                        checked={isKetoFriendly}
                                                        onChange={(e) => setIsKetoFriendly(e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer group">
                                                <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">Gluten-Free</span>
                                                <div className="relative inline-flex items-center">
                                                    <input
                                                        className="sr-only peer"
                                                        type="checkbox"
                                                        checked={isGlutenFree}
                                                        onChange={(e) => setIsGlutenFree(e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </div>
                                            </label>
                                        </div>
                                        <hr className="my-6 border-slate-100" />
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Complexity</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => setComplexity('easy')}
                                                    className={`py-2 text-xs font-bold border-2 rounded-lg transition-all ${complexity === 'easy'
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-slate-100 hover:border-primary/50 text-slate-500'
                                                        }`}
                                                >
                                                    Easy
                                                </button>
                                                <button
                                                    onClick={() => setComplexity('medium')}
                                                    className={`py-2 text-xs font-bold border-2 rounded-lg transition-all ${complexity === 'medium'
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-slate-100 hover:border-primary/50 text-slate-500'
                                                        }`}
                                                >
                                                    Med
                                                </button>
                                                <button
                                                    onClick={() => setComplexity('hard')}
                                                    className={`py-2 text-xs font-bold border-2 rounded-lg transition-all ${complexity === 'hard'
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-slate-100 hover:border-primary/50 text-slate-500'
                                                        }`}
                                                >
                                                    Hard
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Pantry Card */}
                                    <div className="bg-gradient-to-br from-accent to-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-accent/20">
                                        <Warehouse className="w-10 h-10 mb-4" />
                                        <h4 className="text-lg font-bold">Your Pantry</h4>
                                        <p className="text-sm opacity-90 mb-4">You have 12 ingredients expiring soon. Check them now!</p>
                                        <button
                                            onClick={() => setActiveTab('pantry')}
                                            className="w-full bg-white text-accent py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                                        >
                                            Review Pantry
                                        </button>
                                    </div>
                                </aside>

                                {/* Right Section: Recipe Grid */}
                                <div className="lg:col-span-3">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {results.length > 0 ? 'Results for you' : 'Suggested for You'}
                                        </h3>
                                        <div className="relative">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                className="appearance-none cursor-pointer text-slate-500 shadow-sm border border-slate-100 bg-white px-4 py-2 pr-10 rounded-lg text-sm hover:border-primary transition-colors outline-none"
                                            >
                                                <option value="best-match">Best Match</option>
                                                <option value="time">Cooking Time</option>
                                                <option value="difficulty">Difficulty</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {sortedRecipes.length > 0 ? (
                                            sortedRecipes.map((recipe) => (
                                                <RecipeCard
                                                    key={recipe.id}
                                                    recipe={recipe}
                                                    onClick={() => handleRecipeClick(recipe)}
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-20">
                                                <div className="bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 p-12">
                                                    <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                                    <p className="text-slate-400 text-lg font-medium mb-2">No recipes match your filters</p>
                                                    <p className="text-slate-400 text-sm">Try adjusting your preferences or complexity level</p>
                                                </div>
                                            </div>
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
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

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
