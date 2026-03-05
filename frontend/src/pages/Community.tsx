import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Heart, Award, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function Community() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const features = [
        {
            icon: Share2,
            title: 'Share Your Creations',
            description: 'Post photos of your dishes, share recipes, and inspire others with your culinary journey.',
            image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&q=80',
            stats: '50K+ posts daily'
        },
        {
            icon: MessageCircle,
            title: 'Connect & Learn',
            description: 'Join cooking groups, participate in challenges, and learn from chefs around the world.',
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=80',
            stats: '200+ active groups'
        },
        {
            icon: Award,
            title: 'Earn Recognition',
            description: 'Get badges, climb leaderboards, and become a featured community chef.',
            image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&q=80',
            stats: '100+ achievements'
        }
    ];

    const stats = [
        { value: '500K+', label: 'Active Members' },
        { value: '2M+', label: 'Recipes Shared' },
        { value: '150+', label: 'Countries' },
        { value: '10M+', label: 'Monthly Interactions' }
    ];

    const spotlights = [
        {
            name: 'Maria Chen',
            location: 'Singapore',
            specialty: 'Asian Fusion',
            image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=80',
            achievement: 'Top Chef 2025'
        },
        {
            name: 'Kwame Osei',
            location: 'Ghana',
            specialty: 'West African Cuisine',
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&q=80',
            achievement: 'Rising Star'
        },
        {
            name: 'Priya Sharma',
            location: 'India',
            specialty: 'Traditional Indian',
            image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&q=80',
            achievement: 'Community Hero'
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

            {/* Hero */}
            <header className="pt-32 pb-20 px-8 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Join a Global<br />
                        <span className="text-primary">Cooking Community</span>
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Connect with 500,000+ home chefs, share recipes, and learn from culinary enthusiasts worldwide.
                    </p>
                </div>
            </header>

            {/* Stats */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg border border-slate-200 hover:scale-105 transition-transform">
                            <div className="text-5xl font-black text-primary mb-2">{stat.value}</div>
                            <div className="text-slate-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-16">What You Can Do</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setActiveTab(index)}
                                className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200 ${activeTab === index ? 'ring-4 ring-primary/20 scale-105' : ''
                                    }`}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                                        {feature.stats}
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-2xl font-black text-slate-900">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Community Spotlights */}
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-4">Community Spotlights</h2>
                    <p className="text-xl text-slate-600 text-center mb-16">Meet some of our amazing community members</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {spotlights.map((member, index) => (
                            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 group">
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-5 h-5 text-yellow-400" />
                                            <span className="text-sm font-bold text-yellow-400">{member.achievement}</span>
                                        </div>
                                        <h3 className="text-2xl font-black mb-1">{member.name}</h3>
                                        <p className="text-sm opacity-90">{member.location}</p>
                                        <p className="text-sm font-medium mt-2">{member.specialty}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-lg">
                    <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h2 className="text-5xl font-black text-slate-900 mb-6">Ready to Join?</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                        Become part of the world's most vibrant cooking community. Share, learn, and grow with us.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-primary text-white px-12 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 transition-all"
                    >
                        Join the Community
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
