import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const sections = [
        {
            icon: Database,
            title: 'Information We Collect',
            content: [
                'Account information (name, email, password)',
                'Profile data (dietary preferences, cooking skill level)',
                'Usage data (recipes viewed, ingredients searched)',
                'Device information (browser type, IP address)',
                'Cookies and similar tracking technologies'
            ]
        },
        {
            icon: Eye,
            title: 'How We Use Your Information',
            content: [
                'Provide and improve our AI-powered recipe services',
                'Personalize your cooking experience and recommendations',
                'Send you updates, newsletters, and promotional content',
                'Analyze usage patterns to enhance our platform',
                'Ensure security and prevent fraudulent activity'
            ]
        },
        {
            icon: Lock,
            title: 'Data Security',
            content: [
                'Industry-standard encryption for data transmission',
                'Secure servers with regular security audits',
                'Limited employee access to personal information',
                'Regular backups and disaster recovery procedures',
                'Compliance with GDPR, CCPA, and other regulations'
            ]
        },
        {
            icon: UserCheck,
            title: 'Your Rights',
            content: [
                'Access your personal data at any time',
                'Request correction of inaccurate information',
                'Delete your account and associated data',
                'Opt-out of marketing communications',
                'Export your data in a portable format'
            ]
        },
        {
            icon: Globe,
            title: 'Data Sharing',
            content: [
                'We do not sell your personal information',
                'Share with service providers (hosting, analytics)',
                'Comply with legal obligations when required',
                'Aggregate anonymized data for research',
                'Community features (only with your consent)'
            ]
        },
        {
            icon: Shield,
            title: 'Data Retention',
            content: [
                'Active accounts: data retained while account is active',
                'Deleted accounts: data removed within 30 days',
                'Legal requirements: retained as required by law',
                'Anonymized data: may be retained for analytics',
                'Backup systems: purged within 90 days'
            ]
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
                        <Shield className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-sm text-slate-500 mt-6">
                        Last updated: March 5, 2026
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-20">
                {/* Introduction */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 mb-12">
                    <p className="text-lg text-slate-600 leading-relaxed">
                        At Recipe AI, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our
                        AI-powered cooking platform. By using Recipe AI, you agree to the collection and use of information in accordance
                        with this policy.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                            <div className="flex items-start gap-6">
                                <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
                                    <section.icon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-black text-slate-900 mb-6">{section.title}</h2>
                                    <ul className="space-y-3">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                                <span className="text-slate-600 leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-primary/5 rounded-3xl p-10 border-2 border-primary/20">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Questions About Privacy?</h2>
                    <p className="text-lg text-slate-600 mb-6">
                        If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
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
                            className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold border-2 border-slate-200 hover:border-primary transition-all text-center"
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
