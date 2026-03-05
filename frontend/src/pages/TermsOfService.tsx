import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale, Users } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function TermsOfService() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const sections = [
        {
            icon: CheckCircle,
            title: 'Acceptance of Terms',
            content: 'By accessing and using Recipe AI, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of any changes.'
        },
        {
            icon: Users,
            title: 'User Accounts',
            content: 'You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 13 years old to create an account. Provide accurate and complete information during registration.'
        },
        {
            icon: Scale,
            title: 'Acceptable Use',
            content: 'You agree to use Recipe AI only for lawful purposes. Prohibited activities include: attempting to hack or disrupt our services, uploading malicious content, impersonating others, scraping or copying content without permission, and using the service for commercial purposes without authorization.'
        },
        {
            icon: FileText,
            title: 'Intellectual Property',
            content: 'All content on Recipe AI, including recipes, text, graphics, logos, and software, is owned by Recipe AI or our licensors. You may not copy, modify, distribute, or create derivative works without our written permission. User-generated content remains your property, but you grant us a license to use it.'
        },
        {
            icon: AlertTriangle,
            title: 'Disclaimers',
            content: 'Recipe AI is provided "as is" without warranties of any kind. We do not guarantee the accuracy of recipes or nutritional information. Always verify dietary restrictions and food allergies. We are not liable for any health issues, allergic reactions, or food-related incidents resulting from using our recipes.'
        },
        {
            icon: XCircle,
            title: 'Limitation of Liability',
            content: 'Recipe AI and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the past 12 months, or $100, whichever is greater.'
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
                        <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Please read these terms carefully before using Recipe AI. They govern your use of our platform and services.
                    </p>
                    <p className="text-sm text-slate-500 mt-6">
                        Last updated: March 5, 2026
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-20">
                {/* Introduction */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 mb-12">
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        Welcome to Recipe AI. These Terms of Service ("Terms") govern your access to and use of our AI-powered
                        cooking platform, including our website, mobile applications, and related services (collectively, the "Service").
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        By using Recipe AI, you agree to comply with and be bound by these Terms. If you do not agree with any
                        part of these Terms, you may not access or use our Service.
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
                                    <h2 className="text-3xl font-black text-slate-900 mb-4">{section.title}</h2>
                                    <p className="text-slate-600 leading-relaxed text-lg">{section.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Terms */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Subscription & Payments</h3>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Pro subscriptions billed monthly or annually</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Cancel anytime, no refunds for partial periods</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Prices subject to change with notice</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Termination</h3>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-start gap-2">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span>We may suspend or terminate accounts for violations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span>You may delete your account at any time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span>Certain provisions survive termination</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-primary/5 rounded-3xl p-10 border-2 border-primary/20">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Questions About These Terms?</h2>
                    <p className="text-lg text-slate-600 mb-6">
                        If you have any questions about our Terms of Service, please contact our legal team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
                        >
                            Contact Us
                        </button>
                        <a
                            href="mailto:legal@recipeai.com"
                            className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold border-2 border-slate-200 hover:border-primary transition-all text-center"
                        >
                            legal@recipeai.com
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
