import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, Shield, Heart, Globe, Utensils, LucideIcon } from 'lucide-react';
import Footer from '../components/Layout/Footer';

interface Section {
    title: string;
    content: string;
    icon: LucideIcon;
}

interface PageData {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    sections: Section[];
}

const PAGE_CONTENT: Record<string, PageData> = {
    'how-it-works': {
        title: 'How It Works',
        subtitle: 'The engineering behind your personal AI chef.',
        icon: Globe,
        sections: [
            {
                title: 'Data-Driven Culinary Insights',
                content: 'Our AI analyzes millions of flavor profiles and cooking techniques to understand the essence of every dish. We don\'t just follow recipes; we understand the chemistry of taste.',
                icon: Zap
            },
            {
                title: 'Real-Time Inventory Sync',
                content: 'Connect your smart kitchen devices or manually update your pantry. Our system tracks availability and expiration dates to suggest the perfect meal at the perfect time.',
                icon: Shield
            }
        ]
    },
    'features': {
        title: 'Platform Features',
        subtitle: 'Every tool you need for a master-class kitchen.',
        icon: Sparkles,
        sections: [
            {
                title: 'Personalized AI Recipes',
                content: 'Gourmet instructions tailored to your dietary needs, skill level, and available ingredients.',
                icon: Heart
            },
            {
                title: 'Pantry Intelligence',
                content: 'Automated shopping lists and waste reduction insights powered by neural networks.',
                icon: Utensils
            }
        ]
    },
    'about-us': {
        title: 'Our Mission',
        subtitle: 'Redefining the relationship between technology and taste.',
        icon: Heart,
        sections: [
            {
                title: 'Culinary democratization',
                content: 'We believe everyone should have access to gourmet-quality instruction and meal planning, regardless of their background.',
                icon: Globe
            },
            {
                title: 'Pure Innovation',
                content: 'Relentlessly pushing the boundaries of what AI can do in the domestic kitchen environment.',
                icon: Sparkles
            }
        ]
    }
};

export default function InfoPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const content = slug ? PAGE_CONTENT[slug] : null;

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
            <header className="pt-48 pb-24 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full -z-10 bg-primary/5 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-[-20%]"></div>
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
                        <content.icon className="w-10 h-10" />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                        {content.title}
                    </h1>
                    <p className="text-2xl text-slate-500 font-medium italic max-w-2xl mx-auto">
                        "{content.subtitle}"
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-4xl mx-auto px-8 pb-32 space-y-24">
                {content.sections.map((section, i) => (
                    <section key={i} className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 group">
                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <section.icon className="w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-slate-900">{section.title}</h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                {section.content}
                            </p>
                            <div className="w-12 h-1 bg-primary/20 rounded-full group-hover:w-full transition-all duration-1000"></div>
                        </div>
                    </section>
                ))}

                {/* Integration with main flow */}
                <div className="pt-16 border-t border-slate-200 text-center space-y-10">
                    <h3 className="text-2xl font-black text-slate-900">Ready to experience the future?</h3>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 transition-all"
                    >
                        Get Started Free
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
