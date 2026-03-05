import { useState } from 'react';
import { BookOpen, Search, Star, Clock, Users, ChefHat, Sparkles, TrendingUp, Plus, X } from 'lucide-react';

interface Cookbook {
    id: string;
    title: string;
    author: string;
    description: string;
    image_url: string;
    rating: number;
    recipes_count: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    cuisine_type: string;
    tags: string[];
    website_url?: string;
    download_url?: string;
    created_at?: string;
    updated_at?: string;
}

export default function Cookbooks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedCookbook, setSelectedCookbook] = useState<Cookbook | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCookbook, setNewCookbook] = useState({
        title: '',
        author: '',
        description: '',
        image_url: '',
        cuisine_type: '',
        difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        tags: '',
        website_url: '',
        download_url: ''
    });
    const [userCookbooks, setUserCookbooks] = useState<Cookbook[]>([]);

    // Demo cookbooks data
    const demoCookbooks: Cookbook[] = [
        {
            id: '1',
            title: 'Mediterranean Delights',
            author: 'Chef Maria Santos',
            description: 'Explore the vibrant flavors of Mediterranean cuisine with 50+ authentic recipes.',
            image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
            rating: 4.8,
            recipes_count: 52,
            difficulty: 'intermediate',
            cuisine_type: 'Mediterranean',
            tags: ['healthy', 'seafood', 'vegetables'],
            website_url: 'https://example.com/mediterranean-delights',
            download_url: 'https://example.com/downloads/mediterranean-delights.pdf'
        },
        {
            id: '2',
            title: 'Vegan Kitchen Essentials',
            author: 'Chef Alex Green',
            description: 'Master plant-based cooking with easy-to-follow recipes for every meal.',
            image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            rating: 4.9,
            recipes_count: 68,
            difficulty: 'beginner',
            cuisine_type: 'International',
            tags: ['vegan', 'healthy', 'quick'],
            website_url: 'https://example.com/vegan-kitchen',
            download_url: 'https://example.com/downloads/vegan-kitchen.pdf'
        },
        {
            id: '3',
            title: 'Asian Fusion Mastery',
            author: 'Chef Kenji Tanaka',
            description: 'Blend traditional Asian techniques with modern flavors in 75 innovative recipes.',
            image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
            rating: 4.7,
            recipes_count: 75,
            difficulty: 'advanced',
            cuisine_type: 'Asian',
            tags: ['fusion', 'authentic', 'spicy'],
            website_url: 'https://example.com/asian-fusion',
            download_url: 'https://example.com/downloads/asian-fusion.pdf'
        },
        {
            id: '4',
            title: 'Keto Made Simple',
            author: 'Chef Sarah Williams',
            description: 'Low-carb, high-flavor recipes that make keto lifestyle delicious and sustainable.',
            image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
            rating: 4.6,
            recipes_count: 45,
            difficulty: 'beginner',
            cuisine_type: 'American',
            tags: ['keto', 'low-carb', 'healthy'],
            website_url: 'https://example.com/keto-simple',
            download_url: 'https://example.com/downloads/keto-simple.pdf'
        },
        {
            id: '5',
            title: 'French Pastry Perfection',
            author: 'Chef Pierre Dubois',
            description: 'Learn the art of French pastry with detailed techniques and classic recipes.',
            image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
            rating: 4.9,
            recipes_count: 38,
            difficulty: 'advanced',
            cuisine_type: 'French',
            tags: ['baking', 'desserts', 'pastry'],
            website_url: 'https://example.com/french-pastry',
            download_url: 'https://example.com/downloads/french-pastry.pdf'
        },
        {
            id: '6',
            title: 'Quick Family Meals',
            author: 'Chef Emma Johnson',
            description: '30-minute recipes that bring the whole family together at the dinner table.',
            image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
            rating: 4.5,
            recipes_count: 60,
            difficulty: 'beginner',
            cuisine_type: 'American',
            tags: ['quick', 'family-friendly', 'budget'],
            website_url: 'https://example.com/family-meals',
            download_url: 'https://example.com/downloads/family-meals.pdf'
        }
    ];

    const categories = [
        { id: 'all', label: 'All Cookbooks', icon: BookOpen },
        { id: 'trending', label: 'Trending', icon: TrendingUp },
        { id: 'ai-recommended', label: 'AI Recommended', icon: Sparkles },
        { id: 'beginner', label: 'Beginner Friendly', icon: ChefHat }
    ];

    // Combine demo and user cookbooks
    const allCookbooks = [...demoCookbooks, ...userCookbooks];

    const filteredCookbooks = allCookbooks.filter(cookbook => {
        const matchesSearch = cookbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cookbook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cookbook.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedCategory === 'all') return matchesSearch;
        if (selectedCategory === 'beginner') return matchesSearch && cookbook.difficulty === 'beginner';
        if (selectedCategory === 'trending') return matchesSearch && cookbook.rating >= 4.7;
        if (selectedCategory === 'ai-recommended') return matchesSearch && cookbook.tags.includes('healthy');

        return matchesSearch;
    });

    const handleAddCookbook = () => {
        const cookbook: Cookbook = {
            id: `user-${Date.now()}`,
            title: newCookbook.title,
            author: newCookbook.author,
            description: newCookbook.description,
            image_url: newCookbook.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
            rating: 0,
            recipes_count: 0,
            difficulty: newCookbook.difficulty,
            cuisine_type: newCookbook.cuisine_type,
            tags: newCookbook.tags.split(',').map(t => t.trim()).filter(t => t),
            website_url: newCookbook.website_url || undefined,
            download_url: newCookbook.download_url || undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        setUserCookbooks([...userCookbooks, cookbook]);
        setIsAddModalOpen(false);
        setNewCookbook({
            title: '',
            author: '',
            description: '',
            image_url: '',
            cuisine_type: '',
            difficulty: 'beginner',
            tags: '',
            website_url: '',
            download_url: ''
        });
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 pt-16 md:pt-0">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-orange-50 to-white px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-10 h-10 text-primary" />
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Cookbooks</h1>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">Add Cookbook</span>
                        </button>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg mb-8">Discover curated collections of recipes from world-class chefs</p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search cookbooks by title, author, or cuisine..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="px-4 md:px-8 py-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Cookbooks Grid */}
            <div className="px-4 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-slate-600">
                            {filteredCookbooks.length} {filteredCookbooks.length === 1 ? 'cookbook' : 'cookbooks'} found
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCookbooks.map((cookbook) => (
                            <div
                                key={cookbook.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={cookbook.image_url}
                                        alt={cookbook.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-sm">{cookbook.rating}</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                            {cookbook.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-primary font-medium mb-2">{cookbook.author}</p>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{cookbook.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            {cookbook.recipes_count} recipes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {cookbook.difficulty}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {cookbook.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedCookbook(cookbook)}
                                        className="w-full bg-slate-900 hover:bg-primary text-white py-3 rounded-xl font-bold transition-all"
                                    >
                                        View Cookbook
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCookbooks.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">No cookbooks found matching your search</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Cookbook Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-slate-900">Add New Cookbook</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={newCookbook.title}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Italian Classics"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Author *</label>
                                <input
                                    type="text"
                                    value={newCookbook.author}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, author: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Chef Mario"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                                <textarea
                                    value={newCookbook.description}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    rows={3}
                                    placeholder="Brief description of the cookbook..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={newCookbook.image_url}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Cuisine Type *</label>
                                <input
                                    type="text"
                                    value={newCookbook.cuisine_type}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, cuisine_type: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Italian, Asian, Mexican"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty *</label>
                                <select
                                    value={newCookbook.difficulty}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, difficulty: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={newCookbook.tags}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, tags: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., healthy, quick, vegetarian"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Website URL</label>
                                <input
                                    type="url"
                                    value={newCookbook.website_url}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, website_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="https://example.com/cookbook"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Download URL</label>
                                <input
                                    type="url"
                                    value={newCookbook.download_url}
                                    onChange={(e) => setNewCookbook({ ...newCookbook, download_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="https://example.com/downloads/cookbook.pdf"
                                />
                            </div>
                            <button
                                onClick={handleAddCookbook}
                                disabled={!newCookbook.title || !newCookbook.author || !newCookbook.description || !newCookbook.cuisine_type}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Cookbook
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Cookbook Modal */}
            {selectedCookbook && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative h-64">
                            <img
                                src={selectedCookbook.image_url}
                                alt={selectedCookbook.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedCookbook(null)}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedCookbook.title}</h2>
                                    <p className="text-primary font-medium">{selectedCookbook.author}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold">{selectedCookbook.rating}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-slate-500" />
                                    <span className="text-slate-600">{selectedCookbook.recipes_count} recipes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-slate-500" />
                                    <span className="text-slate-600 capitalize">{selectedCookbook.difficulty}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                                <p className="text-slate-600">{selectedCookbook.description}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">Cuisine</h3>
                                <p className="text-slate-600">{selectedCookbook.cuisine_type}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCookbook.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {selectedCookbook.download_url && (
                                    <a
                                        href={selectedCookbook.download_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                    </a>
                                )}
                                {selectedCookbook.website_url && (
                                    <a
                                        href={selectedCookbook.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Visit Website
                                    </a>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedCookbook(null)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
