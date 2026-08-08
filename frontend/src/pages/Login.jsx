import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!form.email.trim() || !form.password.trim()) {
            setError('Please fill in all required fields');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await login(form.email, form.password);
            if (res.user.role === 'employer') navigate('/employer-dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-6">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-7">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                        J
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome to Job Portal</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Please Log-in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field pr-10"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-5 text-xs">
                        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="accent-indigo-600 w-4 h-4 cursor-pointer"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember Me</span>
                        </label>
                    </div>

                    <button className="btn btn-primary w-full py-3" type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : 'Login'}
                    </button>
                </form>

                <ErrorMessage message={error} />

                <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
                    New on our platform?{' '}
                    <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-700">
                        Create an account!
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
