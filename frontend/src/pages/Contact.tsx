import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Footer from '../components/Layout/Footer';

export default function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Us',
            description: 'Get in touch via email',
            contact: 'hello@recipeai.com',
            action: 'Send Email'
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: '24/7 support available',
            contact: 'Start a conversation',
            action: 'Open Chat'
        },
        {
            icon: Phone,
            title: 'Call Us',
            description: 'Mon-Fri, 9am-6pm EST',
            contact: '+1 (555) 123-4567',
            action: 'Call Now'
        }
    ];

    const offices = [
        {
            city: 'San Francisco',
            address: '123 Tech Street, CA 94105',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80'
        },
        {
            city: 'London',
            address: '456 Innovation Ave, EC2A 4BX',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'
        },
        {
            city: 'Singapore',
            address: '789 Marina Bay, 018956',
            image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80'
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
                        Let's <span className="text-primary">Connect</span>
                    </h1>
                    <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Have questions, feedback, or partnership ideas? We'd love to hear from you.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-20">
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 group text-center">
                            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                                <method.icon className="w-8 h-8 text-primary group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{method.title}</h3>
                            <p className="text-slate-600 mb-4">{method.description}</p>
                            <p className="text-lg font-bold text-primary mb-6">{method.contact}</p>
                            <button className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                                {method.action}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Contact Form & Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Form */}
                    <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200">
                        <h2 className="text-4xl font-black text-slate-900 mb-8">Send Us a Message</h2>
                        {submitted ? (
                            <div className="text-center py-12">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-600">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-colors"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-colors resize-none"
                                        placeholder="Tell us more..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:scale-105 active:scale-95 shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200">
                            <h3 className="text-3xl font-black text-slate-900 mb-6">Quick Answers</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">General Inquiries</h4>
                                    <p className="text-slate-600">hello@recipeai.com</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Technical Support</h4>
                                    <p className="text-slate-600">support@recipeai.com</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Partnerships</h4>
                                    <p className="text-slate-600">partners@recipeai.com</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Press & Media</h4>
                                    <p className="text-slate-600">press@recipeai.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/10 rounded-3xl p-10 border-2 border-primary/20">
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Need Immediate Help?</h3>
                            <p className="text-slate-600 mb-6">
                                Check out our Help Center for instant answers to common questions.
                            </p>
                            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                                Visit Help Center
                            </button>
                        </div>
                    </div>
                </div>

                {/* Office Locations */}
                <div className="mb-20">
                    <h2 className="text-5xl font-black text-slate-900 text-center mb-4">Our Offices</h2>
                    <p className="text-xl text-slate-600 text-center mb-16">Visit us around the world</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {offices.map((office, index) => (
                            <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={office.image}
                                        alt={office.city}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <MapPin className="w-5 h-5 mb-2" />
                                        <h3 className="text-2xl font-black">{office.city}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-600">{office.address}</p>
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
