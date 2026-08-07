import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [job, setJob] = useState(null);
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axiosInstance.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load job');
            }
        };

        fetchJob();
    }, [id]);

    const handleApply = async () => {
        try {
            await axiosInstance.post('/applications', { jobId: id, resume });
            setMessage('Application submitted successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to apply');
        }
    };

    if (!job) return <div className="loader">Loading...</div>;

    return (
        <div className="card">
            <h2>{job.title}</h2>
            <p className="muted">{job.company} • {job.location}</p>
            <p>{job.description}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <div className="mt">
                {job.skills?.map((skill) => <span key={skill} className="badge">{skill}</span>)}
            </div>
            {user?.role === 'candidate' && (
                <div className="mt">
                    <input value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Resume link or note" />
                    <button className="primary mt" onClick={handleApply}>Apply</button>
                </div>
            )}
            {user?.role === 'employer' && (
                <div className="mt">
                    <button className="secondary" onClick={() => navigate('/employer-dashboard')}>Go to Dashboard</button>
                </div>
            )}
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default JobDetail;
