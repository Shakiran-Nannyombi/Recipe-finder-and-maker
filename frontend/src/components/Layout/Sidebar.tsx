import React from 'react';
import { Home, Sparkles, Bookmark, UtensilsCrossed, Settings, User } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'generator', label: 'Recipe AI', icon: Sparkles },
        { id: 'saved', label: 'Saved Recipes', icon: Bookmark },
        { id: 'pantry', label: 'Pantry', icon: UtensilsCrossed },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-24 md:w-64 flex-shrink-0 bg-white border-r border-primary/10 flex flex-col transition-all duration-300 z-30">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary rounded-xl p-0.5 flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                    <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-10 h-10 object-cover" />
                </div>
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Recipe AI</h1>
                    <p className="text-xs text-primary font-medium uppercase tracking-widest">Food-Tech</p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-6 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'
                                }`} />
                            <span className="font-medium hidden md:block">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Chef Julian</p>
                        <p className="text-xs text-slate-400">Pro Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
