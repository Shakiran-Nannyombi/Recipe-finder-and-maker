import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('recipe_ai_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('recipe_ai_token');
            localStorage.removeItem('recipe_ai_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
