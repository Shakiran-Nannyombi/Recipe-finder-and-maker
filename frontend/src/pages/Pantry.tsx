import { useState } from 'react';
import { Warehouse, Plus, Search, Trash2, AlertCircle, Sparkles, Calendar, X } from 'lucide-react';

interface PantryItem {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    category: 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice' | 'other';
    expiryDate?: string;
    addedDate: string;
}

export default function Pantry() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: '',
        unit: '',
        category: 'other' as PantryItem['category'],
        expiryDate: ''
    });

    const [pantryItems, setPantryItems] = useState<PantryItem[]>([
        {
            id: '1',
            name: 'Fresh Salmon',
            quantity: '500',
            unit: 'g',
            category: 'protein',
            expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            addedDate: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Spinach',
            quantity: '200',
            unit: 'g',
            category: 'vegetable',
            expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            addedDate: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Lemon',
            quantity: '3',
            unit: 'whole',
            category: 'other',
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            addedDate: new Date().toISOString()
        },
        {
            id: '4',
            name: 'Garlic',
            quantity: '1',
            unit: 'bulb',
            category: 'vegetable',
            addedDate: new Date().toISOString()
        },
        {
            id: '5',
            name: 'Olive Oil',
            quantity: '500',
            unit: 'ml',
            category: 'other',
            addedDate: new Date().toISOString()
        },
        {
            id: '6',
            name: 'Paprika',
            quantity: '50',
            unit: 'g',
            category: 'spice',
            addedDate: new Date().toISOString()
        },
        {
            id: '7',
            name: 'Quinoa',
            quantity: '300',
            unit: 'g',
            category: 'grain',
            addedDate: new Date().toISOString()
        },
        {
            id: '8',
            name: 'Feta Cheese',
            quantity: '200',
            unit: 'g',
            category: 'dairy',
            expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            addedDate: new Date().toISOString()
        }
    ]);

    const categories = [
        { id: 'all', label: 'All Items', count: pantryItems.length },
        { id: 'protein', label: 'Protein', count: pantryItems.filter(i => i.category === 'protein').length },
        { id: 'vegetable', label: 'Vegetables', count: pantryItems.filter(i => i.category === 'vegetable').length },
        { id: 'grain', label: 'Grains', count: pantryItems.filter(i => i.category === 'grain').length },
        { id: 'dairy', label: 'Dairy', count: pantryItems.filter(i => i.category === 'dairy').length },
        { id: 'spice', label: 'Spices', count: pantryItems.filter(i => i.category === 'spice').length },
        { id: 'other', label: 'Other', count: pantryItems.filter(i => i.category === 'other').length }
    ];

    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredItems = pantryItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const expiringItems = pantryItems.filter(item => {
        if (!item.expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
    });

    const handleAddItem = () => {
        const item: PantryItem = {
            id: `item-${Date.now()}`,
            name: newItem.name,
            quantity: newItem.quantity,
            unit: newItem.unit,
            category: newItem.category,
            expiryDate: newItem.expiryDate || undefined,
            addedDate: new Date().toISOString()
        };

        setPantryItems([...pantryItems, item]);
        setIsAddModalOpen(false);
        setNewItem({
            name: '',
            quantity: '',
            unit: '',
            category: 'other',
            expiryDate: ''
        });
    };

    const handleRemoveItem = (id: string) => {
        setPantryItems(pantryItems.filter(item => item.id !== id));
    };

    const getDaysUntilExpiry = (expiryDate?: string) => {
        if (!expiryDate) return null;
        return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 pt-16 md:pt-0">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-orange-50 to-white px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Warehouse className="w-10 h-10 text-orange-500" />
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Smart Pantry</h1>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">Add Item</span>
                        </button>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg mb-8">Track your ingredients and never waste food again</p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your pantry..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="px-4 md:px-8 py-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                {category.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedCategory === category.id
                                    ? 'bg-white/20'
                                    : 'bg-slate-100'
                                    }`}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Pantry List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-slate-900">
                                    {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.label} ({filteredItems.length})
                                </h3>
                                <div className="space-y-3">
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map(item => {
                                            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                                            const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${isExpiringSoon
                                                        ? 'bg-red-50 border-2 border-red-200'
                                                        : 'bg-slate-50 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                                                            {isExpiringSoon && (
                                                                <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <p className="text-sm text-slate-600">
                                                                {item.quantity} {item.unit}
                                                            </p>
                                                            <span className="px-2 py-0.5 bg-white border border-slate-200 text-xs font-medium rounded-full text-slate-600 capitalize">
                                                                {item.category}
                                                            </span>
                                                            {item.expiryDate && !isExpiringSoon && (
                                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(item.expiryDate).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12">
                                            <Warehouse className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-400">No items found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Expiring Soon Alert */}
                            {expiringItems.length > 0 && (
                                <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                        <h3 className="font-bold text-red-900">Expiring Soon</h3>
                                    </div>
                                    <p className="text-sm text-red-700 mb-4">
                                        {expiringItems.length} {expiringItems.length === 1 ? 'item' : 'items'} expiring in the next 3 days
                                    </p>
                                    <div className="space-y-2">
                                        {expiringItems.map(item => (
                                            <div key={item.id} className="text-sm">
                                                <span className="font-medium text-red-900">{item.name}</span>
                                                <span className="text-red-600"> - {getDaysUntilExpiry(item.expiryDate)} days</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AI Suggestions */}
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-6 h-6" />
                                    <h3 className="font-bold">AI Suggestions</h3>
                                </div>
                                <p className="text-sm opacity-90 mb-4">
                                    Based on your pantry, we suggest making "Grilled Salmon with Lemon" today!
                                </p>
                                <button className="w-full bg-white text-orange-500 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                                    View Recipe
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4">Pantry Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Total Items</span>
                                        <span className="font-bold text-slate-900">{pantryItems.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Expiring Soon</span>
                                        <span className="font-bold text-red-600">{expiringItems.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Categories</span>
                                        <span className="font-bold text-slate-900">{categories.length - 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">Add Pantry Item</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Item Name *</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                    placeholder="e.g., Fresh Salmon"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity *</label>
                                    <input
                                        type="text"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        placeholder="e.g., 500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Unit *</label>
                                    <input
                                        type="text"
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        placeholder="e.g., g, ml"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                >
                                    <option value="protein">Protein</option>
                                    <option value="vegetable">Vegetable</option>
                                    <option value="grain">Grain</option>
                                    <option value="dairy">Dairy</option>
                                    <option value="spice">Spice</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    value={newItem.expiryDate}
                                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleAddItem}
                                disabled={!newItem.name || !newItem.quantity || !newItem.unit}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Pantry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
