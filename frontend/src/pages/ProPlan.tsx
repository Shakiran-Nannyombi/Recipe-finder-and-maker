import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Crown, Sparkles } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function ProPlan() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const plans = [
        {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for trying out Recipe AI',
            features: [
                '10 AI recipes per month',
                'Basic meal planning',
                'Standard recipe library',
                'Community access',
                'Email support'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Pro',
            price: { monthly: 12, yearly: 120 },
            description: 'For serious home chefs',
            features: [
                'Unlimited AI recipes',
                'Advanced dietary customization',
                'Priority AI processing',
                'Video cooking guides',
                'Family meal planning (8 members)',
                'Premium support 24/7',
                'Nutrition tracking',
                'Smart shopping lists',
                'Recipe collections',
                'Ad-free experience'
            ],
            cta: 'Start Pro Trial',
            popular: true
        },
        {
            name: 'Chef',
            price: { monthly: 29, yearly: 290 },
            description: 'For culinary professionals',
            features: [
                'Everything in Pro',
                'API access',
                'Custom recipe algorithms',
                'White-label options',
                'Dedicated account manager',
                'Advanced analytics',
                'Team collaboration tools',
                'Priority feature requests'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    const proFeatures = [
        {
            title: 'Unlimited Recipe Generation',
            description: 'Generate as many recipes as you want with no daily limits. Perfect for meal prep enthusiasts.',
            image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&q=80',
            icon: Zap
        },
        {
            title: 'Advanced Dietary Customization',
            description: 'Fine-tune recipes for specific macros, allergies, and health goals with detailed nutritional breakdowns.',
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=80',
            icon: Sparkles
        },
        {
            title: 'Priority AI Processing',
            description: 'Skip the queue with priority access to our AI engines. Get instant recipe generation even during peak hours.',
            image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&q=80',
            icon: Crown
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
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full mb-8">
                        <Crown className="w-5 h-5" />
                        <span className="text-sm font-bold">UPGRADE TO PRO</span>
                    </div>
                    <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Unlock the Full Power<br />
                        of AI Cooking
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Get unlimited recipes, advanced features, and priority support
                    </p>
                </div>
            </header>

            {/* Billing Toggle */}
            <div className="max-w-7xl mx-auto px-8 mb-12">
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-lg font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-16 h-8 bg-primary rounded-full transition-all"
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                            }`}></div>
                    </button>
                    <span className={`text-lg font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                        Yearly
                    </span>
                    {billingCycle === 'yearly' && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                            Save 17%
                        </span>
                    )}
                </div>
            </div>

            {/* Pricing Cards */}
            <main className="max-w-7xl mx-auto px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 ${plan.popular ? 'ring-4 ring-primary scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                                    <p className="text-slate-600 mt-2">{plan.description}</p>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-slate-900">
                                        ${plan.price[billingCycle]}
                                    </span>
                                    <span className="text-slate-600">
                                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate('/signup')}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${plan.popular
                                        ? 'bg-primary text-white hover:scale-105 shadow-lg'
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                        }`}
                                >
                                    {plan.cta}
                                </button>

                                <div className="space-y-3 pt-6 border-t border-slate-200">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pro Features Showcase */}
                <div className="mt-32 space-y-12">
                    <div className="text-center">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">Why Go Pro?</h2>
                        <p className="text-xl text-slate-600">Unlock features that transform your cooking experience</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {proFeatures.map((feature, index) => (
                            <div key={index} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
