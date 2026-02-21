import React from 'react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: 'home' },
        { id: 'generator', label: 'Recipe AI', icon: 'auto_awesome' },
        { id: 'saved', label: 'Saved Recipes', icon: 'bookmark' },
        { id: 'pantry', label: 'Pantry', icon: 'kitchen' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <aside className="w-24 md:w-64 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-primary/10 flex flex-col transition-all duration-300 z-30">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary rounded-xl p-2 flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
                </div>
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Recipe AI</h1>
                    <p className="text-xs text-primary font-medium uppercase tracking-widest">Food-Tech</p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-transform group-hover:scale-110 ${activeTab === item.id ? 'fill-1' : ''
                            }`}>
                            {item.icon}
                        </span>
                        <span className="font-medium hidden md:block">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold">Chef Julian</p>
                        <p className="text-xs text-slate-400">Pro Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
