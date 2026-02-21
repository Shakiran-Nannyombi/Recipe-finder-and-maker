import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err: unknown) {
            let errorMsg = 'Failed to create account. Please try again.';
            if (axios.isAxiosError(err) && err.response?.data?.detail) {
                errorMsg = err.response.data.detail;
            }
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-body overflow-hidden">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=1600"
                    alt="Healthy Ingredients"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-slate-900/90" />

                <div className="relative z-10 max-w-lg space-y-8 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Next-Gen Culinary AI
                    </div>
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        Join the World's Most <span className="text-primary italic">Intelligent</span> Kitchen Community.
                    </h2>
                    <ul className="space-y-4 text-slate-300">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                            Turn ingredients into gourmet recipes instantly
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                            Smart pantry management with AI insights
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                            Collaborate and share with a global community
                        </li>
                    </ul>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 bg-background-light/30 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 animate-fadeIn py-4">
                    <div className="flex flex-col items-center lg:items-start space-y-3">
                        <img src="/RecipeAI.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                            <p className="text-slate-500 text-sm mt-1">Join the world's most intelligent kitchen community.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-xl py-3 pl-10 pr-4 transition-all text-sm"
                                        placeholder="Julian Chef"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-xl py-3 pl-10 pr-4 transition-all text-sm"
                                        placeholder="chef@recipeai.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-xl py-3 pl-10 pr-4 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Crafting Account...' : 'Get Started'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-6 relative text-center">
                            <span className="relative z-10 bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Or join with</span>
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-slate-100"></div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:shadow-md transition-all font-bold text-slate-600 text-xs">
                                <Chrome className="w-4 h-4" /> Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:shadow-md transition-all font-bold text-slate-600 text-xs">
                                <Github className="w-4 h-4" /> GitHub
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 font-medium text-sm">
                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
