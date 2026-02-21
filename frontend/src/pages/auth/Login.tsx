import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: unknown) {
            let errorMsg = 'Invalid email or password. Please try again.';
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
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600"
                    alt="Kitchen Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-slate-900/90" />

                <div className="relative z-10 max-w-lg space-y-8 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Next-Gen Culinary AI
                    </div>
                    <h2 className="text-5xl font-bold text-white leading-tight">
                        Your Personal AI <span className="text-primary italic">Executive Chef</span> Awaits.
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Sign in to access your smart pantry, personalized recipes, and culinary magic.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                            <h4 className="text-white font-bold mb-1">10k+</h4>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Active Chefs</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                            <h4 className="text-white font-bold mb-1">50k+</h4>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Recipes Crafted</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-background-light/30">
                <div className="w-full max-w-md space-y-8 animate-fadeIn">
                    <div className="flex flex-col items-center lg:items-start space-y-4">
                        <img src="/RecipeAI.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 mt-2">The AI kitchen is waiting for your creativity.</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 transition-all"
                                        placeholder="chef@recipeai.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Brewing...' : 'Sign In'}
                                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-8 relative text-center">
                            <span className="relative z-10 bg-white px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Or continue with</span>
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-slate-100"></div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all font-bold text-slate-600">
                                <Chrome className="w-5 h-5" /> Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all font-bold text-slate-600">
                                <Github className="w-5 h-5" /> GitHub
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 font-medium">
                        New to the kitchen? <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
