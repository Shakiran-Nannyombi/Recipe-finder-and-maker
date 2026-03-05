import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Code, Palette, ChefHat, Heart, Zap, Globe, Users } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function Careers() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const openings = [
        {
            title: 'Senior ML Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            icon: Code,
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80'
        },
        {
            title: 'Product Designer',
            department: 'Design',
            location: 'Remote',
            type: 'Full-time',
            icon: Palette,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'
        },
        {
            title: 'Culinary Content Creator',
            department: 'Content',
            location: 'Hybrid',
            type: 'Full-time',
            icon: ChefHat,
            image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80'
        },
        {
            title: 'Data Scientist',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            icon: Code,
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80'
        },
        {
            title: 'Community Manager',
            department: 'Marketing',
            location: 'Remote',
            type: 'Full-time',
            icon: Users,
            image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&q=80'
        },
        {
            title: 'Nutritionist',
            department: 'Product',
            location: 'Hybrid',
            type: 'Part-time',
            icon: Heart,
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=80'
        }
    ];

    const benefits = [
        {
            icon: Globe,
            title: 'Work From Anywhere',
            description: 'Fully remote-first company with team members in 30+ countries'
        },
        {
            icon: Heart,
            title: 'Health & Wellness',
            description: 'Comprehensive health insurance, mental health support, and fitness stipend'
        },
        {
            icon: Zap,
            title: 'Growth & Learning',
            description: '$2000 annual learning budget and mentorship programs'
        },
        {
            icon: Users,
            title: 'Inclusive Culture',
            description: 'Diverse team, regular team events, and open communication'
        }
    ];

    const values = [
        'Innovation First',
        'User Obsessed',
        'Sustainable Impact',
        'Radical Transparency',
        'Continuous Learning',
        'Global Mindset'
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
                        Build the Future<br />
                        of <span className="text-primary">Food Tech</span>
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Join our mission to make cooking accessible, sustainable, and joyful for millions worldwide.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-20">
                {/* Why Join Us */}
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-16">Why Recipe AI?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 group">
                                <div className="flex items-start gap-6">
                                    <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                                        <benefit.icon className="w-8 h-8 text-primary group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Values */}
                <div className="bg-white rounded-3xl p-16 shadow-lg border border-slate-200 mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all">
                                <span className="text-lg font-bold text-slate-900">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-4">Open Positions</h2>
                    <p className="text-xl text-slate-600 text-center mb-16">Join our growing team</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {openings.map((job, index) => (
                            <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 cursor-pointer hover:scale-105">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={job.image}
                                        alt={job.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                                        <job.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {job.type}
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                        <span className="font-medium">{job.department}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                    </div>
                                    <button className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-lg">
                    <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h2 className="text-5xl font-black text-slate-900 mb-6">Don't See Your Role?</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                        We're always looking for talented people. Send us your resume and let's talk about how you can contribute.
                    </p>
                    <button
                        onClick={() => navigate('/info/contact')}
                        className="bg-primary text-white px-12 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 transition-all"
                    >
                        Get in Touch
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
