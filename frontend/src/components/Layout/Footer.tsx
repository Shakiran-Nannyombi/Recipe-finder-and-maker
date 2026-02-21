import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-12 px-8 overflow-hidden font-body">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="space-y-4 col-span-1 md:col-span-1">
                    <div className="flex items-center gap-3">
                        <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Recipe AI</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        The world's most intelligent culinary assistant, helping you turn every meal into a masterpiece.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Links Sections */}
                <div className="space-y-4">
                    <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest">Platform</h4>
                    <ul className="space-y-2 text-slate-500 text-sm">
                        <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Pro Plan</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">AI Insights</a></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest">Company</h4>
                    <ul className="space-y-2 text-slate-500 text-sm">
                        <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest">Newsletter</h4>
                    <p className="text-slate-500 text-sm">Get the latest recipes and AI tips delivered to your inbox.</p>
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-xl py-3 px-4 text-sm transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-medium uppercase tracking-widest">
                <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Cookie Policy</a>
                </div>
                <div>© 2026 Recipe AI Corp. All rights reserved.</div>
            </div>
        </footer>
    );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);
