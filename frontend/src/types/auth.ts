export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    demoLogin: () => void;
    logout: () => void;
}
