import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

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
        <div className="min-h-screen bg-background-light flex items-center justify-center p-6 font-body">
            <div className="max-w-md w-full animate-fadeIn">
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center bg-primary rounded-2xl p-2 shadow-lg shadow-primary/20 mb-2">
                        <img src="/RecipeAI.png" alt="Logo" className="w-10 h-10 object-cover" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500">Join the world's most intelligent kitchen community.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none rounded-2xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="Julian Chef"
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
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
                            className={`w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Crafting Account...' : 'Get Started'}
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 relative text-center">
                        <span className="relative z-10 bg-white px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Or join with</span>
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

                <p className="mt-10 text-center text-slate-500 font-medium">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
                </p>
            </div>
        </div>
    );
}
