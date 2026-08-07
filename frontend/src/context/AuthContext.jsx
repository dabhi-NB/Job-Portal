import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        const { token: authToken, user: authUser } = response.data;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(authUser));
        setToken(authToken);
        setUser(authUser);
        return response.data;
    };

    const register = async (formData) => {
        const response = await axiosInstance.post('/auth/register', formData);
        const { token: authToken, user: authUser } = response.data;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(authUser));
        setToken(authToken);
        setUser(authUser);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
