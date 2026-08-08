import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const verifyUserToken = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                // Verify JWT token signature with backend server to prevent role tampering in localStorage
                const res = await axiosInstance.get('/auth/me');
                const verifiedUser = res.data.user;
                setUser(verifiedUser);
                localStorage.setItem('user', JSON.stringify(verifiedUser));
            } catch (err) {
                console.error('JWT Token validation failed or user role tampered:', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyUserToken();
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

    const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
