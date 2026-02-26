import React, { useState, ReactNode } from 'react';
import api from '../api';
import { User } from '../types/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('recipe_ai_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('recipe_ai_token'));

    const login = async (email: string, password: string) => {
        const response = await api.post('/api/auth/login', { email, password });
        const { access_token } = response.data;

        // Fetch user info after login
        const userResponse = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userData = userResponse.data;
        setToken(access_token);
        setUser(userData);

        localStorage.setItem('recipe_ai_token', access_token);
        localStorage.setItem('recipe_ai_user', JSON.stringify(userData));
    };

    const signup = async (name: string, email: string, password: string) => {
        const response = await api.post('/api/auth/signup', { name, email, password });
        const { access_token } = response.data;

        const userResponse = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userData = userResponse.data;
        setToken(access_token);
        setUser(userData);

        localStorage.setItem('recipe_ai_token', access_token);
        localStorage.setItem('recipe_ai_user', JSON.stringify(userData));
    };

    const demoLogin = () => {
        const demoUser: User = {
            id: 'demo-user-001',
            name: 'Demo Chef',
            email: 'demo@recipeai.com',
        };
        const demoToken = 'demo-token-no-backend';
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('recipe_ai_token', demoToken);
        localStorage.setItem('recipe_ai_user', JSON.stringify(demoUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('recipe_ai_token');
        localStorage.removeItem('recipe_ai_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, signup, demoLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
