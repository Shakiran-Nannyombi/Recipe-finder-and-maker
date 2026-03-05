import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Zap, TrendingUp, Target, Leaf } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function AIInsights() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const insights = [
        {
            title: 'Flavor Profile Analysis',
            description: 'Our AI understands the molecular composition of ingredients and predicts flavor combinations with 98% accuracy.',
            icon: Brain,
            stats: { accuracy: '98%', compounds: '10,000+', pairings: '1M+' },
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'
        },
        {
            title: 'Cooking Technique Optimization',
            description: 'Machine learning models trained on thousands of professional cooking videos optimize timing and temperature.',
            icon: Zap,
            stats: { videos: '50,000+', techniques: '500+', precision: '99.2%' },
            image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80'
        },
        {
            title: 'Nutritional Intelligence',
            description: 'Real-time nutritional analysis and optimization that balances taste with health goals.',
            icon: Target,
            stats: { nutrients: '150+', accuracy: '99.5%', swaps: '10,000+' },
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'
        },
        {
            title: 'Waste Prediction Engine',
            description: 'Predictive analytics forecast ingredient usage patterns, reducing food waste by an average of 60%.',
            icon: Leaf,
            stats: { reduction: '60%', savings: '$400/yr', impact: '2M+ meals' },
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80'
        },
        {
            title: 'Personalization Algorithm',
            description: 'Deep learning models analyze your cooking history to create a unique taste profile that evolves.',
            icon: Sparkles,
            stats: { dataPoints: '1000+', learning: 'Continuous', accuracy: '95%' },
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80'
        },
        {
            title: 'Seasonal Optimization',
            description: 'AI considers seasonal availability and local produce for fresher, more sustainable recipes.',
            icon: TrendingUp,
            stats: { regions: '200+', seasons: 'Real-time', freshness: '100%' },
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80'
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
                        The Intelligence Behind<br />
                        Every Perfect Meal
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Cutting-edge AI and machine learning powering your culinary journey
                    </p>
                </div>
            </header>

            {/* AI Insights Grid */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-primary hover:shadow-2xl transition-all duration-500 hover:scale-105"
                        >
                            {/* Image Section */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={insight.image}
                                    alt={insight.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-lg">
                                    <insight.icon className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6">
                                <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                    {insight.title}
                                </h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {insight.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                                    {Object.entries(insight.stats).map(([key, value], i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-2xl font-black text-primary">{value}</div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{key}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technology Stack */}
                <div className="mt-32 bg-white rounded-[3rem] p-16 border border-slate-200 shadow-lg">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">Our Technology Stack</h2>
                        <p className="text-xl text-slate-600">Built on cutting-edge AI and machine learning frameworks</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['TensorFlow', 'PyTorch', 'GPT-4', 'Neural Networks', 'Computer Vision', 'NLP', 'Deep Learning', 'Cloud AI'].map((tech, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200 hover:border-primary hover:shadow-lg transition-all hover:scale-105">
                                <div className="text-xl font-black text-slate-900">{tech}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-32 text-center space-y-8">
                    <h2 className="text-5xl font-black text-slate-900">Experience AI-Powered Cooking</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Join thousands of users leveraging artificial intelligence to create amazing meals
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-primary text-white px-12 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 transition-all"
                    >
                        Get Started Free
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
