import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Zap, Shield, Heart, CheckCircle, Clock, Utensils } from 'lucide-react';
import Footer from '../components/Layout/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useGSAP(() => {
        // Hero Content
        gsap.from('.hero-content > *', {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out'
        });

        // Hero Image
        gsap.from('.hero-image', {
            scale: 0.8,
            opacity: 0,
            duration: 1.5,
            delay: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });

        // Feature Cards
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });

        // CTA Section
        gsap.from('.cta-box', {
            scrollTrigger: {
                trigger: '.cta-box',
                start: 'top 90%',
            },
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }, { scope: container });

    return (
        <div ref={container} className="min-h-screen bg-background-light font-body overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 py-5 flex items-center justify-center ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-100' : 'bg-transparent'}`}>
                <div className="max-w-7xl w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary rounded-xl p-1.5 shadow-lg shadow-primary/20">
                            <img src="/RecipeAI.png" alt="Recipe AI Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">Recipe AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10 text-slate-600 font-bold text-sm uppercase tracking-widest">
                        <a href="#features" className="hover:text-primary transition-colors">Experience</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">Methods</a>
                        <a href="#stats" className="hover:text-primary transition-colors">Impact</a>
                    </div>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-600 font-bold hover:text-primary transition-all hover:scale-105"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-slate-900 text-white px-7 py-3 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-32 px-8">
                <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="hero-content space-y-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            Next-Gen Culinary Intelligence
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                            Your Kitchen, <br />
                            <span className="text-primary italic">Reimagined.</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                            Stop staring at your fridge wondering what's for dinner. Our AI creates personalized gourmet experiences from whatever you have on hand.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group hover:-translate-y-1"
                            >
                                Ignite the Magic
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 text-slate-900 font-bold hover:text-primary transition-all group">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl border border-slate-100 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                </div>
                                See it in Action
                            </button>
                        </div>

                        <div className="pt-10 flex items-center gap-8 border-t border-slate-200/60">
                            <div className="flex -space-x-4">
                                {[34, 45, 67, 89].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-lg" alt="Chef" />
                                ))}
                            </div>
                            <div>
                                <p className="text-slate-900 font-black text-lg">10,000+ Chefs</p>
                                <p className="text-slate-500 font-bold text-sm">Crafting daily masterpieces</p>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image relative">
                        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[12px] border-white group">
                            <img
                                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200"
                                alt="Culinary Masterpiece"
                                className="w-full h-[650px] object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl animate-float">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div className="text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Analysis</p>
                                        <p className="font-bold text-sm">Gourmet Potential: 98%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-10 right-10 space-y-4">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem]">
                                    <h3 className="text-white font-black text-2xl mb-2">Honey-Glazed Salmon</h3>
                                    <div className="flex items-center gap-6">
                                        <span className="flex items-center gap-2 text-white/90 text-sm font-bold"><Clock className="w-4 h-4 text-primary" /> 18 Mins</span>
                                        <span className="flex items-center gap-2 text-white/90 text-sm font-bold"><Utensils className="w-4 h-4 text-accent" /> Intermediate</span>
                                        <span className="flex items-center gap-2 text-white/90 text-sm font-bold"><Heart className="w-4 h-4 text-red-500 fill-red-500" /> Favorite</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Image Card */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-80 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden hidden md:block group hover:translate-y-[-10px] transition-transform duration-500">
                            <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Prep" />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-32 px-8 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-6 mb-24 max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">Supercharge Your <br /><span className="text-primary underline decoration-accent/30 underline-offset-8">Culinary Workflow</span></h2>
                        <p className="text-xl text-slate-500 font-medium italic">Professional-grade tools for the home chef.</p>
                    </div>

                    <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: Zap,
                                title: "Instant Magic",
                                desc: "High-end recipes generated in milliseconds from your current pantry inventory.",
                                color: "text-primary",
                                bg: "bg-primary/10",
                                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                            },
                            {
                                icon: Shield,
                                title: "Smart Guard",
                                desc: "Real-time expiration tracking ensures you never waste a single luxury ingredient.",
                                color: "text-accent",
                                bg: "bg-accent/10",
                                img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
                            },
                            {
                                icon: Heart,
                                title: "Adaptive Taste",
                                desc: "AI that evolves with your palate, learning exactly what you love over time.",
                                color: "text-red-500",
                                bg: "bg-red-500/10",
                                img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="feature-card group relative h-[500px] rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4">
                                <img src={feature.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={feature.title} />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-slate-900/60 to-slate-950/90"></div>

                                <div className="absolute inset-0 p-12 flex flex-col justify-end gap-6">
                                    <div className={`${feature.bg} ${feature.color} w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/20 scale-110 group-hover:scale-125 group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                                        <feature.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">{feature.title}</h3>
                                    <p className="text-slate-300 font-medium leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        {feature.desc}
                                    </p>
                                    <div className="w-12 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-1000"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section with Images */}
            <section id="stats" className="py-24 px-8 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full -z-0 opacity-10">
                    <img src="https://www.transparenttextures.com/patterns/dark-matter.png" alt="" className="w-full h-full object-repeat" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-6 pt-12">
                            <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=600" className="w-full h-64 object-cover rounded-[2rem] shadow-2xl hover:scale-105 transition-transform" alt="Dish 1" />
                            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600" className="w-full h-80 object-cover rounded-[2rem] shadow-2xl hover:scale-105 transition-transform" alt="Dish 2" />
                        </div>
                        <div className="space-y-6">
                            <img src="https://images.unsplash.com/photo-1543352658-927f947d066e?auto=format&fit=crop&q=80&w=600" className="w-full h-80 object-cover rounded-[2rem] shadow-2xl hover:scale-105 transition-transform" alt="Dish 3" />
                            <img src="https://images.unsplash.com/photo-1466632346460-9d535a788753?auto=format&fit=crop&q=80&w=600" className="w-full h-64 object-cover rounded-[2rem] shadow-2xl hover:scale-105 transition-transform" alt="Dish 4" />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h2 className="text-5xl font-black text-white leading-tight">Quantifiable <span className="text-primary italic">Excellence.</span></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            {[
                                { label: "Success Rate", val: "99.8%", desc: "Perfect recipe generation" },
                                { label: "Time Saved", val: "45min", desc: "Average daily prep time" },
                                { label: "Waste Reduced", val: "60%", desc: "Ingredient utilization" },
                                { label: "Varieties", val: "1.2M", desc: "Unique combinations" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2 group">
                                    <p className="text-primary font-black text-4xl tracking-tighter group-hover:scale-110 transition-transform origin-left">{stat.val}</p>
                                    <p className="text-white font-bold text-lg">{stat.label}</p>
                                    <p className="text-slate-500 font-medium text-sm">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <CheckCircle className="w-10 h-10 text-primary" />
                            <p className="text-slate-400 font-medium italic">"The most transformative tool in my kitchen since the induction range." — <span className="text-white font-black not-italic">Chef Marcus T.</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 px-8 text-center bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto rounded-[4rem] bg-slate-900 p-24 relative overflow-hidden cta-box">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary/20"></div>

                    <div className="relative z-10 space-y-10">
                        <h2 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">Your master chef <br /><span className="text-primary italic">is waiting.</span></h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Join the elite circle of home chefs who are redefining the limits of domestic culinary perfection. Start your free journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-3xl shadow-primary/50 flex items-center gap-4 group hover:-translate-y-2 active:scale-95"
                            >
                                Begin Experience
                                <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                            </button>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">No credit card required • Instant access • AI Powered</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
