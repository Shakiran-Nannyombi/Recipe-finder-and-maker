import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Utensils, Zap, ChefHat, Clock, TrendingUp } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function Features() {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const features = [
        {
            title: 'Personalized AI Recipes',
            description: 'Gourmet instructions tailored to your dietary needs, skill level, and available ingredients.',
            icon: ChefHat,
            image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80',
            stats: ['10M+ Recipes', '98% Success Rate', '50+ Cuisines']
        },
        {
            title: 'Pantry Intelligence',
            description: 'Automated shopping lists and waste reduction insights powered by neural networks.',
            icon: Utensils,
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80',
            stats: ['60% Less Waste', 'Smart Tracking', 'Auto Shopping Lists']
        },
        {
            title: 'Smart Meal Planning',
            description: 'Weekly meal plans that balance nutrition, variety, and your schedule.',
            icon: Clock,
            image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80',
            stats: ['7-Day Plans', 'Nutrition Balanced', 'Time Optimized']
        },
        {
            title: 'Real-Time Cooking Guidance',
            description: 'Step-by-step instructions with timers, tips, and technique videos.',
            icon: Zap,
            image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
            stats: ['Live Timers', 'Video Guides', 'Voice Control']
        },
        {
            title: 'Flavor Matching Engine',
            description: 'AI-powered ingredient pairing based on molecular gastronomy principles.',
            icon: Sparkles,
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
            stats: ['1000+ Pairings', 'Science-Based', 'Taste Profiles']
        },
        {
            title: 'Community Favorites',
            description: 'Discover trending recipes and share your culinary creations.',
            icon: Heart,
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
            stats: ['500K+ Users', 'Daily Updates', 'Social Cooking']
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-8 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 font-bold hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
                            <img src="/RecipeAI.png" alt="Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Recipe AI</span>
                    </div>
                </div>
            </nav>

            {/* Hero - Plain */}
            <header className="pt-32 pb-20 px-8 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Everything You Need<br />
                        To Cook Like a Pro
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Powerful AI tools designed to transform your kitchen into a culinary studio
                    </p>
                </div>
            </header>

            {/* Interactive Feature Grid */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setActiveFeature(index)}
                            className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200 ${activeFeature === index ? 'scale-105 ring-4 ring-primary/20' : ''
                                }`}
                        >
                            {/* Image - No gradient overlay */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-4">
                                <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Stats */}
                                <div className="flex gap-4 pt-4">
                                    {feature.stats.map((stat, i) => (
                                        <div key={i} className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                            <span className="text-sm font-bold text-slate-700">{stat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom accent */}
                            <div className={`absolute bottom-0 left-0 right-0 h-2 bg-primary transform origin-left transition-transform duration-500 ${activeFeature === index ? 'scale-x-100' : 'scale-x-0'
                                }`}></div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-32 bg-white border border-slate-200 rounded-[3rem] p-16 text-center shadow-lg">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black text-slate-900">Ready to Start Cooking?</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Join thousands of home chefs using AI to create amazing meals every day
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-primary text-white px-12 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 transition-all"
                        >
                            Get Started Free
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
