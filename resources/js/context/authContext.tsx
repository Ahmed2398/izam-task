import { App } from '@/types';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
    user: App.Models.User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<App.Models.User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isAuthenticated = user !== null;

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/user');
            setUser(response.data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await axios.post('/api/auth/login', { email, password });
        setUser(response.data.user);
        
        // Store the token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        
        // Set the Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    };

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        const response = await axios.post('/api/auth/register', {
            name,
            email,
            password,
            password_confirmation,
        });
        setUser(response.data.user);
        
        // Store the token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        
        // Set the Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
        
        // Remove the token from localStorage
        localStorage.removeItem('auth_token');
        
        // Remove the Authorization header
        delete axios.defaults.headers.common['Authorization'];
    };

    const fetchCsrf = async () => {
        await axios.get('/sanctum/csrf-cookie');
    };

    useEffect(() => {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Set the Authorization header if we have a token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        fetchCsrf().then(() => fetchUser());
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
