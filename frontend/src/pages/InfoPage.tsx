import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, Shield, Heart, Globe, Utensils, LucideIcon, Users, Briefcase, Mail, Award } from 'lucide-react';
import Footer from '../components/Layout/Footer';

interface Section {
    title: string;
    content: string;
    icon: LucideIcon;
    image?: string;
}

interface PageData {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    sections: Section[];
    gradient?: string;
    hasImages?: boolean;
    isPricing?: boolean;
    pricing?: {
        price: string;
        period: string;
        features: string[];
    };
    isStats?: boolean;
    stats?: Array<{
        value: string;
        label: string;
    }>;
}

const PAGE_CONTENT: Record<string, PageData> = {
    'how-it-works': {
        title: 'How It Works',
        subtitle: 'The engineering behind your personal AI chef.',
        icon: Globe,
        gradient: '',
        hasImages: true,
        sections: [
            {
                title: 'Data-Driven Culinary Insights',
                content: 'Our AI analyzes millions of flavor profiles and cooking techniques to understand the essence of every dish. We don\'t just follow recipes; we understand the chemistry of taste.',
                icon: Zap,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80'
            },
            {
                title: 'Real-Time Inventory Sync',
                content: 'Connect your smart kitchen devices or manually update your pantry. Our system tracks availability and expiration dates to suggest the perfect meal at the perfect time.',
                icon: Shield,
                image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80'
            },
            {
                title: 'Adaptive Learning',
                content: 'The more you cook, the smarter we get. Our AI learns your preferences, dietary restrictions, and cooking style to provide increasingly personalized recommendations.',
                icon: Sparkles,
                image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80'
            }
        ]
    },
    'features': {
        title: 'Platform Features',
        subtitle: 'Every tool you need for a master-class kitchen.',
        icon: Sparkles,
        gradient: 'from-purple-500/10 to-pink-500/10',
        sections: [
            {
                title: 'Personalized AI Recipes',
                content: 'Gourmet instructions tailored to your dietary needs, skill level, and available ingredients. Each recipe is optimized for your unique kitchen setup.',
                icon: Heart
            },
            {
                title: 'Pantry Intelligence',
                content: 'Automated shopping lists and waste reduction insights powered by neural networks. Never let ingredients expire again.',
                icon: Utensils
            },
            {
                title: 'Smart Meal Planning',
                content: 'Weekly meal plans that balance nutrition, variety, and your schedule. Our AI considers your calendar and suggests quick meals for busy days.',
                icon: Zap
            }
        ]
    },
    'pro-plan': {
        title: 'Pro Plan',
        subtitle: 'Unlock the full potential of AI-powered cooking.',
        icon: Award,
        gradient: 'from-amber-500/10 to-yellow-500/10',
        isPricing: true,
        pricing: {
            price: '$19.99',
            period: '/month',
            features: [
                'Unlimited Recipe Generation',
                'Advanced Dietary Customization',
                'Priority AI Processing',
                'Video Cooking Guides',
                'Family Meal Planning (up to 8 members)',
                '24/7 Premium Support'
            ]
        },
        sections: [
            {
                title: 'Unlimited Recipe Generation',
                content: 'Generate as many recipes as you want with no daily limits. Perfect for meal prep enthusiasts and professional chefs.',
                icon: Zap
            },
            {
                title: 'Advanced Dietary Customization',
                content: 'Fine-tune recipes for specific macros, allergies, and health goals. Get detailed nutritional breakdowns for every meal.',
                icon: Shield
            },
            {
                title: 'Priority AI Processing',
                content: 'Skip the queue with priority access to our AI engines. Get instant recipe generation even during peak hours.',
                icon: Sparkles
            },
            {
                title: 'Video Cooking Guides',
                content: 'Access exclusive step-by-step video tutorials for complex techniques. Learn from professional chefs in your own kitchen.',
                icon: Users
            },
            {
                title: 'Family Meal Planning',
                content: 'Create meal plans for up to 8 family members with individual dietary preferences. Save time and reduce food waste.',
                icon: Heart
            },
            {
                title: 'Premium Support',
                content: '24/7 priority support from our culinary experts. Get personalized cooking advice and troubleshooting assistance.',
                icon: Mail
            }
        ]
    },
    'ai-insights': {
        title: 'AI Insights',
        subtitle: 'The intelligence behind every perfect meal.',
        icon: Zap,
        gradient: 'from-cyan-500/10 to-blue-500/10',
        isStats: true,
        stats: [
            { value: '98%', label: 'Flavor Prediction Accuracy' },
            { value: '60%', label: 'Average Waste Reduction' },
            { value: '2M+', label: 'Recipes Analyzed' },
            { value: '<2s', label: 'Average Generation Time' }
        ],
        sections: [
            {
                title: 'Flavor Profile Analysis',
                content: 'Our AI understands the molecular composition of ingredients and how they interact. We predict flavor combinations with 98% accuracy based on chemical compounds.',
                icon: Sparkles
            },
            {
                title: 'Cooking Technique Optimization',
                content: 'Machine learning models trained on thousands of professional cooking videos optimize timing, temperature, and technique for your specific equipment.',
                icon: Zap
            },
            {
                title: 'Nutritional Intelligence',
                content: 'Real-time nutritional analysis and optimization. Our AI balances taste with health, suggesting ingredient swaps that maintain flavor while improving nutrition.',
                icon: Shield
            },
            {
                title: 'Waste Prediction Engine',
                content: 'Predictive analytics forecast ingredient usage patterns and expiration dates, reducing food waste by an average of 60% for our users.',
                icon: Globe
            },
            {
                title: 'Personalization Algorithm',
                content: 'Deep learning models analyze your cooking history, ratings, and preferences to create a unique taste profile that evolves with every meal you make.',
                icon: Heart
            },
            {
                title: 'Seasonal & Local Optimization',
                content: 'Our AI considers seasonal availability and local produce to suggest recipes that are fresher, more sustainable, and more affordable.',
                icon: Utensils
            }
        ]
    },
    'about-us': {
        title: 'About Us',
        subtitle: 'Redefining the relationship between technology and taste.',
        icon: Heart,
        gradient: 'from-red-500/10 to-orange-500/10',
        sections: [
            {
                title: 'Our Mission',
                content: 'We believe everyone should have access to gourmet-quality instruction and meal planning, regardless of their background. Culinary excellence should be democratized.',
                icon: Globe
            },
            {
                title: 'Pure Innovation',
                content: 'Relentlessly pushing the boundaries of what AI can do in the domestic kitchen environment. We combine cutting-edge technology with culinary expertise.',
                icon: Sparkles
            },
            {
                title: 'Sustainability First',
                content: 'Reducing food waste and promoting sustainable cooking practices through intelligent ingredient management and eco-friendly recipe suggestions.',
                icon: Shield
            }
        ]
    },
    'community': {
        title: 'Community',
        subtitle: 'Join thousands of home chefs transforming their kitchens.',
        icon: Users,
        gradient: 'from-green-500/10 to-teal-500/10',
        sections: [
            {
                title: 'Share Your Creations',
                content: 'Connect with fellow food enthusiasts, share your culinary masterpieces, and get inspired by what others are cooking.',
                icon: Heart
            },
            {
                title: 'Learn Together',
                content: 'Access exclusive cooking tips, video tutorials, and live sessions with professional chefs from our community.',
                icon: Award
            },
            {
                title: 'Recipe Exchange',
                content: 'Discover and share unique recipes with our global community. Rate, review, and remix recipes to make them your own.',
                icon: Utensils
            }
        ]
    },
    'careers': {
        title: 'Careers',
        subtitle: 'Build the future of food technology with us.',
        icon: Briefcase,
        gradient: 'from-indigo-500/10 to-blue-500/10',
        sections: [
            {
                title: 'Join Our Team',
                content: 'We\'re looking for passionate engineers, designers, and food scientists who want to revolutionize how people cook at home.',
                icon: Users
            },
            {
                title: 'Innovation Culture',
                content: 'Work on cutting-edge AI technology while enjoying flexible hours, remote work options, and a collaborative environment that values creativity.',
                icon: Sparkles
            },
            {
                title: 'Growth Opportunities',
                content: 'Continuous learning, mentorship programs, and clear career progression paths. We invest in our team\'s professional development.',
                icon: Award
            }
        ]
    },
    'contact': {
        title: 'Contact Us',
        subtitle: 'We\'d love to hear from you.',
        icon: Mail,
        gradient: 'from-yellow-500/10 to-orange-500/10',
        sections: [
            {
                title: 'Get in Touch',
                content: 'Have questions, feedback, or partnership inquiries? Our team is here to help. Reach out at hello@recipeai.com',
                icon: Mail
            },
            {
                title: 'Support',
                content: 'Need technical assistance? Our support team is available 24/7 to help you get the most out of Recipe AI.',
                icon: Shield
            },
            {
                title: 'Partnerships',
                content: 'Interested in partnering with us? We\'re always looking for collaborations with food brands, kitchen appliance manufacturers, and culinary institutions.',
                icon: Briefcase
            }
        ]
    }
};

export default function InfoPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const content = slug ? PAGE_CONTENT[slug] : null;

    // Scroll to top when component mounts or slug changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black text-slate-900">Page Not Found</h1>
                    <Link to="/" className="text-primary font-bold hover:underline">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light font-body flex flex-col">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex items-center justify-center">
                <div className="max-w-7xl w-full flex items-center justify-between">
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

            {/* Hero Section */}
            <header className={`pt-48 pb-24 px-8 relative overflow-hidden ${content.gradient ? `bg-gradient-to-br ${content.gradient}` : 'bg-white'}`}>
                {/* Only show decorative elements if gradient exists */}
                {content.gradient && (
                    <div className="absolute inset-0 -z-10 opacity-30">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
                    </div>
                )}
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Creative typography for How It Works */}
                    {slug === 'how-it-works' ? (
                        <>
                            <h1 className="text-8xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                                How <span className="text-primary">It</span> Works
                            </h1>
                            <p className="text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                                {content.subtitle}
                            </p>
                            <div className="flex items-center justify-center gap-4 pt-8">
                                <div className="w-20 h-1 bg-primary rounded-full"></div>
                                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                <div className="w-20 h-1 bg-primary rounded-full"></div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                                {content.title}
                            </h1>
                            <p className="text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                                {content.subtitle}
                            </p>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-5xl mx-auto px-8 py-32 space-y-32">
                {/* Pricing Card for Pro Plan */}
                {content.isPricing && content.pricing && (
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10 text-center space-y-8">
                            <div className="inline-flex items-baseline gap-2">
                                <span className="text-7xl font-black">{content.pricing.price}</span>
                                <span className="text-3xl font-bold opacity-80">{content.pricing.period}</span>
                            </div>
                            <div className="max-w-md mx-auto space-y-4">
                                {content.pricing.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-left">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                        <span className="text-lg font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-white text-amber-600 px-12 py-6 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 shadow-2xl transition-all hover:-translate-y-1"
                            >
                                Start Pro Trial
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Grid for AI Insights */}
                {content.isStats && content.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {content.stats.map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-lg border border-slate-100 hover:scale-105 transition-transform">
                                <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-slate-600 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sections with optional images */}
                {content.sections.map((section, i) => (
                    <section key={i} className={`${content.hasImages ? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-[100px_1fr] gap-10'} group`}>
                        {content.hasImages && section.image ? (
                            // Layout with image
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                                        <section.icon className="w-10 h-10 text-primary" />
                                    </div>
                                </div>
                                <div className="p-10 space-y-4">
                                    <h2 className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors">{section.title}</h2>
                                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                    <div className="w-16 h-1.5 bg-primary/20 rounded-full group-hover:w-full group-hover:bg-primary transition-all duration-1000"></div>
                                </div>
                            </div>
                        ) : (
                            // Original layout without image
                            <>
                                <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-primary/30 transition-all duration-500">
                                    <section.icon className="w-10 h-10" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors">{section.title}</h2>
                                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                    <div className="w-16 h-1.5 bg-primary/20 rounded-full group-hover:w-full group-hover:bg-primary transition-all duration-1000"></div>
                                </div>
                            </>
                        )}
                    </section>
                ))}

                {/* CTA Section */}
                <div className="pt-20 border-t-2 border-slate-200">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-16 text-center space-y-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-black text-white mb-4">Ready to experience the future?</h3>
                            <p className="text-slate-400 text-lg font-medium mb-8 max-w-2xl mx-auto">
                                Join thousands of home chefs who are already transforming their kitchens with AI.
                            </p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-primary text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 shadow-2xl shadow-primary/50 transition-all hover:-translate-y-1"
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
