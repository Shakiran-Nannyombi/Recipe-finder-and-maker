import React from 'react';
import { Home, Sparkles, Bookmark, UtensilsCrossed, Settings, User, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'generator', label: 'Recipe AI', icon: Sparkles },
        { id: 'cookbooks', label: 'Cookbooks', icon: BookOpen },
        { id: 'saved', label: 'Saved Recipes', icon: Bookmark },
        { id: 'pantry', label: 'Pantry', icon: UtensilsCrossed },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleNavClick = (tabId: string) => {
        onTabChange(tabId);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 768) {
            onToggle();
        }
    };

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-8 h-8 object-contain" />
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">Recipe AI</h1>
                        <p className="text-xs text-primary font-medium uppercase tracking-widest">Food-Tech</p>
                    </div>
                </div>

                {/* Hamburger Button with Animation */}
                <button
                    onClick={onToggle}
                    className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span
                            className={`block h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''
                                }`}
                        />
                        <span
                            className={`block h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                        />
                        <span
                            className={`block h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''
                                }`}
                        />
                    </div>
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative
                    top-0 left-0 
                    h-screen md:h-auto
                    w-full md:w-64 flex-shrink-0
                    bg-white md:border-r border-primary/10
                    flex flex-col
                    z-40
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    ${!isOpen && 'md:w-20'}
                `}
            >
                {/* Desktop Logo */}
                <div className="hidden md:flex p-6 items-center gap-3">
                    <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-10 h-10 object-contain" />
                    <div className={`transition-all duration-300 ${!isOpen && 'md:hidden'}`}>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Recipe AI</h1>
                        <p className="text-xs text-primary font-medium uppercase tracking-widest">Food-Tech</p>
                    </div>
                </div>

                {/* Mobile Logo (in sidebar) */}
                <div className="md:hidden p-4 flex items-center justify-center gap-2 border-b border-slate-100">
                    <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-8 h-8 object-contain" />
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">Recipe AI</h1>
                        <p className="text-xs text-primary font-medium uppercase tracking-widest">Food-Tech</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 md:px-4 py-3 md:mt-6 space-y-1.5 md:space-y-2 overflow-y-auto flex flex-col justify-center md:justify-start">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`w-full flex items-center gap-3 md:gap-4 px-4 py-2.5 md:py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                                    : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'
                                        }`}
                                />
                                <span
                                    className={`font-medium text-sm md:text-sm transition-all duration-300 ${isActive ? 'font-bold' : ''
                                        } ${!isOpen && 'md:hidden'}`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-3 md:p-6 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-3 justify-start">
                        <div className="size-9 md:size-10 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                            <User className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className={`transition-all duration-300 ${!isOpen && 'md:hidden'}`}>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                                {user?.name || 'Chef Guest'}
                            </p>
                            <p className="text-xs text-slate-400">Pro Plan</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 md:gap-4 px-4 py-2.5 md:py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                    >
                        <LogOut className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 flex-shrink-0" />
                        <span className={`font-medium text-sm transition-all duration-300 ${!isOpen && 'md:hidden'}`}>
                            Logout
                        </span>
                    </button>
                </div>

                {/* Desktop Toggle Button */}
                <button
                    onClick={onToggle}
                    className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    aria-label="Toggle sidebar"
                >
                    {isOpen ? (
                        <X className="w-3 h-3" />
                    ) : (
                        <Menu className="w-3 h-3" />
                    )}
                </button>
            </aside>
        </>
    );
}

