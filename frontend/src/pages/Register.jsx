import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError('Please fill in all required fields');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long');
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
            await register(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create an Account</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Join Job Portal as a Candidate or Employer</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Enter email address"
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
                                placeholder="Enter password (min 6 chars)"
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

                    <div className="flex flex-col gap-1.5 mb-5">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            I want to join as <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <div
                                className={`flex-1 py-2.5 px-3 border rounded-xl text-center cursor-pointer text-xs font-bold transition-all select-none ${
                                    form.role === 'candidate'
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                                }`}
                                onClick={() => setForm({ ...form, role: 'candidate' })}
                            >
                                👨‍💼 Candidate
                            </div>
                            <div
                                className={`flex-1 py-2.5 px-3 border rounded-xl text-center cursor-pointer text-xs font-bold transition-all select-none ${
                                    form.role === 'employer'
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500'
                                }`}
                                onClick={() => setForm({ ...form, role: 'employer' })}
                            >
                                🏢 Employer
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary w-full py-3 mt-2" type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : 'Register Account'}
                    </button>
                </form>

                <ErrorMessage message={error} />

                <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-700">
                        Log in!
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
