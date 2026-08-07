import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import SearchFilterBar from '../components/SearchFilterBar';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchJobs = async (filters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const res = await axiosInstance.get(`/jobs?${params.toString()}`);
            setJobs(res.data.jobs || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div>
            <div className="hero-panel">
                <h2>Find your next opportunity</h2>
                <p>Browse jobs, apply quickly, and keep your applications organized in one place.</p>
            </div>
            <SearchFilterBar onFilter={fetchJobs} />
            <h2 className="mt">Available Jobs</h2>
            {loading && <div className="loader">Loading jobs...</div>}
            {error && <p className="error">{error}</p>}
            {!loading && jobs.length === 0 && <p className="muted">No jobs found.</p>}
            <div className="grid grid-2 mt">
                {jobs.map((job) => (
                    <div key={job._id} className="card">
                        <h3>{job.title}</h3>
                        <p className="muted">{job.company} • {job.location}</p>
                        <p>{job.description}</p>
                        <div className="mt">
                            {job.skills?.map((skill) => <span key={skill} className="badge">{skill}</span>)}
                        </div>
                        <div className="row mt">
                            <strong>Salary: {job.salary}</strong>
                            <Link to={`/jobs/${job._id}`}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
