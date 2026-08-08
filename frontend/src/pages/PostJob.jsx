import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ErrorMessage from '../components/ErrorMessage';

const PostJob = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editJob = location.state?.job || null;

    const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', skills: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editJob) {
            setForm({
                title: editJob.title || '',
                company: editJob.company || '',
                description: editJob.description || '',
                location: editJob.location || '',
                salary: editJob.salary || '',
                skills: editJob.skills?.join(', ') || ''
            });
        }
    }, [editJob]);

    const validate = () => {
        if (!form.title.trim() || !form.company.trim() || !form.description.trim() || !form.location.trim()) {
            setError('Please fill in all required fields (Title, Company, Description, Location)');
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
            const payload = {
                ...form,
                skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
                salary: Number(form.salary) || 0
            };

            if (editJob) {
                await axiosInstance.put(`/jobs/${editJob._id}`, payload);
            } else {
                await axiosInstance.post('/jobs', payload);
            }
            navigate('/employer-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to save job posting');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{editJob ? 'Edit Job Posting' : 'Post a New Job'}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 mt-1">
                    {editJob ? 'Update the details below to modify your job listing.' : 'Fill out the details below to create a new job opening for candidates.'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Senior Frontend Developer"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Acme Corporation"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Ahmedabad, MH or Remote"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Salary ($ per year / month)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 60000"
                            value={form.salary}
                            onChange={(e) => setForm({ ...form, salary: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Required Skills (Comma separated)</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. React, Node.js, Express, MongoDB"
                            value={form.skills}
                            onChange={(e) => setForm({ ...form, skills: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Job Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="input-field"
                            rows="6"
                            placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-6" disabled={loading}>
                            {loading ? 'Saving...' : editJob ? 'Update Job' : 'Publish Job'}
                        </button>
                    </div>
                </form>

                <ErrorMessage message={error} />
            </div>
        </div>
    );
};

export default PostJob;
