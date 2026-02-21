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
        <div className="h-screen bg-white flex font-body overflow-hidden">
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
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 lg:p-12 bg-background-light/30">
                <div className="w-full max-w-md space-y-4 animate-fadeIn">
                    <div className="flex flex-col items-center lg:items-start space-y-3">
                        <img src="/RecipeAI.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 text-sm mt-1">The AI kitchen is waiting for your creativity.</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 md:p-7 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-700">Password</label>
                                    <a href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot?</a>
                                </div>
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
                                {isLoading ? 'Brewing...' : 'Sign In'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-4 relative text-center">
                            <span className="relative z-10 bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Or continue with</span>
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-slate-100"></div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:shadow-md transition-all font-bold text-slate-600 text-[10px]">
                                <Chrome className="w-4 h-4" /> Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:shadow-md transition-all font-bold text-slate-600 text-[10px]">
                                <Github className="w-4 h-4" /> GitHub
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 font-medium text-xs">
                        New to the kitchen? <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
