import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const PostJob = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', skills: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/jobs', { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean), salary: Number(form.salary) });
            setMessage('Job posted successfully');
            navigate('/employer-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create job');
        }
    };

    return (
        <div className="card">
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit} className="form-grid">
                <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <input type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                <button className="primary" type="submit">Post Job</button>
            </form>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default PostJob;
