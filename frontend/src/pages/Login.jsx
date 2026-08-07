import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(form.email, form.password);
            if (res.user.role === 'employer') navigate('/employer-dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form-grid">
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
                <button className="primary" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Login;
