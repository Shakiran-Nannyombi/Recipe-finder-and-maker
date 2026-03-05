import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Globe, Shield, Users, Award, Target } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function AboutUs() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const values = [
        {
            icon: Globe,
            title: 'Global Accessibility',
            description: 'Making gourmet cooking accessible to everyone, everywhere, regardless of background or experience.',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'
        },
        {
            icon: Shield,
            title: 'Sustainability First',
            description: 'Reducing food waste and promoting eco-friendly cooking practices through intelligent AI.',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80'
        },
        {
            icon: Heart,
            title: 'Community Driven',
            description: 'Building a diverse global community of food lovers who share, learn, and grow together.',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80'
        }
    ];

    const team = [
        { role: 'Engineers', count: '50+', description: 'AI & ML experts' },
        { role: 'Chefs', count: '20+', description: 'Culinary professionals' },
        { role: 'Countries', count: '30+', description: 'Global team' },
        { role: 'Languages', count: '15+', description: 'Supported' }
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
                        Redefining the Future<br />
                        of <span className="text-primary">Home Cooking</span>
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        We believe technology and culinary art can work together to make cooking accessible, sustainable, and joyful for everyone.
                    </p>
                </div>
            </header>

            {/* Mission Statement */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="bg-white rounded-3xl p-16 shadow-lg border border-slate-200 mb-20">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex p-4 rounded-2xl bg-primary/10">
                            <Target className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-5xl font-black text-slate-900">Our Mission</h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            To democratize culinary excellence by combining cutting-edge AI technology with traditional cooking wisdom,
                            making gourmet-quality meal preparation accessible to everyone while promoting sustainability and reducing food waste.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-16">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={value.image}
                                        alt={value.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                        <value.icon className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-2xl font-black text-slate-900">{value.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Stats */}
                <div className="bg-white rounded-3xl p-16 shadow-lg border border-slate-200 mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-16">Our Global Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {team.map((stat, index) => (
                            <div key={index} className="text-center space-y-3">
                                <div className="text-6xl font-black text-primary">{stat.count}</div>
                                <div className="text-xl font-bold text-slate-900">{stat.role}</div>
                                <div className="text-slate-600">{stat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Story Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6">
                        <h2 className="text-5xl font-black text-slate-900">Our Story</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Founded in 2024, Recipe AI started with a simple observation: millions of people struggle with meal planning,
                            waste food, and feel intimidated by cooking. We knew AI could help.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Today, we're a diverse team of engineers, chefs, nutritionists, and food scientists from over 30 countries,
                            united by a passion for making cooking accessible and sustainable for everyone.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We've helped over 500,000 users reduce food waste by 60%, discover new cuisines, and gain confidence in the kitchen.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                            alt="Our Story"
                            className="rounded-3xl shadow-2xl border border-slate-200"
                        />
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-lg">
                    <h2 className="text-5xl font-black text-slate-900 mb-6">Join Our Journey</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                        Be part of the cooking revolution. Start creating amazing meals with AI today.
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
