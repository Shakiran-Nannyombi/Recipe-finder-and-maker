import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Zap, Shield, Heart } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background-light font-body overflow-x-hidden">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="bg-primary rounded-xl p-1 shadow-lg shadow-primary/20">
                        <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-8 h-8 object-cover" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">Recipe AI</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                    <a href="#testimonials" className="hover:text-primary transition-colors">Stories</a>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-600 font-bold hover:text-primary transition-colors"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary transition-all shadow-lg shadow-slate-900/10"
                    >
                        Join Now
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10 space-y-8 animate-fadeIn">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" />
                            Next-Gen Culinary AI
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                            Cook Like a <span className="text-primary">Pro</span>, with Zero Effort.
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                            Transform your random ingredients into gourmet masterpieces. Let our AI handle the recipes, while you enjoy the cooking.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-slate-900 font-bold hover:text-primary transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-5 h-5 fill-primary text-primary ml-1" />
                                </div>
                                Watch Demo
                            </button>
                        </div>
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden`}>
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500">
                                <span className="font-bold text-slate-900">10k+</span> chefs already using Recipe AI
                            </p>
                        </div>
                    </div>

                    <div className="relative animate-fadeInRight" style={{ animationDelay: '0.2s' }}>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white group">
                            <img
                                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200"
                                alt="Culinary Masterpiece"
                                className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl">
                                    <p className="text-white font-bold text-lg mb-1">Roasted Salmon w/ Lemon</p>
                                    <div className="flex items-center gap-4 text-white/80 text-sm">
                                        <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-accent" /> High Protein</span>
                                        <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-primary fill-primary" /> Loved by AI</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative floating elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl font-bold text-slate-900">Supercharge Your Kitchen</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Our advanced AI tools make cooking intuitive, fun, and personalized just for you.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Instant Magic", desc: "Get gourmet recipes in seconds based on what's in your fridge.", color: "text-primary", bg: "bg-primary/10" },
                            { icon: Shield, title: "Smart Pantry", desc: "Never let ingredients go to waste. We track expirations for you.", color: "text-accent", bg: "bg-accent/10" },
                            { icon: Heart, title: "Personalized", desc: "Learns your taste, dietary needs, and skill level over time.", color: "text-red-500", bg: "bg-red-500/10" }
                        ].map((feature, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-background-light border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className={`${feature.bg} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-8">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 p-16 relative overflow-hidden text-center space-y-8">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-5xl font-bold text-white leading-tight">Ready to transform your cooking?</h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">Join thousands of home chefs who have discovered the joy of AI-assisted culinary creativity.</p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-primary/40 inline-flex items-center gap-3 group"
                        >
                            Get Started for Free
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-8 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500 text-sm">
                    <div className="flex items-center gap-3">
                        <img src="/RecipeAI.png" alt="Logo" className="w-6 h-6 opacity-50" />
                        <span className="font-bold text-slate-900">Recipe AI</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                    <div>© 2026 Recipe AI. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
