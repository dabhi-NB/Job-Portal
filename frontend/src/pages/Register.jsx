import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
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
        <div className="card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form-grid">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="candidate">Candidate</option>
                    <option value="employer">Employer</option>
                </select>
                <button className="primary" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Register'}</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Register;
