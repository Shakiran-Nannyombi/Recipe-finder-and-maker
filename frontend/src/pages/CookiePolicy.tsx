import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, BarChart, Shield, Globe, Zap } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function CookiePolicy() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const cookieTypes = [
        {
            icon: Shield,
            title: 'Essential Cookies',
            description: 'Required for the website to function properly. Cannot be disabled.',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            examples: ['Authentication', 'Security', 'Load balancing', 'Session management']
        },
        {
            icon: Settings,
            title: 'Functional Cookies',
            description: 'Remember your preferences and settings for a better experience.',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            examples: ['Language preference', 'Theme settings', 'Dietary restrictions', 'Saved recipes']
        },
        {
            icon: BarChart,
            title: 'Analytics Cookies',
            description: 'Help us understand how you use our site to improve our services.',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            examples: ['Google Analytics', 'Page views', 'User behavior', 'Performance metrics']
        },
        {
            icon: Zap,
            title: 'Marketing Cookies',
            description: 'Track your activity to show you relevant ads and content.',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            examples: ['Ad targeting', 'Social media', 'Campaign tracking', 'Retargeting']
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
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
                        <Cookie className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Cookie Policy
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Learn about how we use cookies and similar technologies to enhance your experience on Recipe AI.
                    </p>
                    <p className="text-sm text-slate-500 mt-6">
                        Last updated: March 5, 2026
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-20">
                {/* Introduction */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-6">What Are Cookies?</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-4">
                        Cookies are small text files that are placed on your device when you visit a website. They help websites
                        remember your preferences, improve functionality, and provide analytics about how the site is used.
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Recipe AI uses cookies and similar technologies to enhance your cooking experience, personalize content,
                        and analyze our traffic. This policy explains what cookies we use and why.
                    </p>
                </div>

                {/* Cookie Types */}
                <div className="mb-12">
                    <h2 className="text-4xl font-black text-slate-900 text-center mb-12">Types of Cookies We Use</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {cookieTypes.map((type, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                                <div className={`inline-flex p-4 rounded-2xl ${type.bgColor} mb-6`}>
                                    <type.icon className={`w-8 h-8 ${type.color}`} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3">{type.title}</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">{type.description}</p>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-700">Examples:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {type.examples.map((example, i) => (
                                            <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                                                {example}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Third-Party Cookies */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 mb-12">
                    <div className="flex items-start gap-6">
                        <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
                            <Globe className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4">Third-Party Cookies</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                We work with trusted third-party services that may also set cookies on your device. These include:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Google Analytics - for website analytics and performance monitoring',
                                    'Stripe - for secure payment processing',
                                    'Social media platforms - for sharing and social features',
                                    'Content delivery networks - for faster page loading',
                                    'Customer support tools - for live chat and help desk'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span className="text-slate-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Managing Cookies */}
                <div className="bg-gradient-to-br from-primary/5 to-purple/5 rounded-3xl p-10 border-2 border-primary/20 mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-6">Managing Your Cookie Preferences</h2>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        You have control over which cookies you accept. Here's how to manage your preferences:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Browser Settings</h3>
                            <p className="text-slate-600">
                                Most browsers allow you to refuse or delete cookies. Check your browser's help section for instructions.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Cookie Consent Tool</h3>
                            <p className="text-slate-600">
                                Use our cookie consent banner to customize which types of cookies you accept.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Opt-Out Links</h3>
                            <p className="text-slate-600">
                                Visit third-party websites to opt out of their tracking (e.g., Google Analytics opt-out).
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Do Not Track</h3>
                            <p className="text-slate-600">
                                We respect Do Not Track signals from your browser when technically feasible.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Disabling certain cookies may affect the functionality of Recipe AI and limit your experience.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Questions About Cookies?</h2>
                    <p className="text-lg text-slate-600 mb-6">
                        If you have questions about our use of cookies or this policy, please contact us.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
                        >
                            Contact Us
                        </button>
                        <a
                            href="mailto:privacy@recipeai.com"
                            className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all text-center"
                        >
                            privacy@recipeai.com
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
