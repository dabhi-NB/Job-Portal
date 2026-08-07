import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const EmployerDashboard = () => {
    const { token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get('/jobs');
                setJobs(res.data.jobs || []);
                if (res.data.jobs?.length) {
                    setSelectedJob(res.data.jobs[0]._id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [token]);

    useEffect(() => {
        if (!selectedJob) return;
        const fetchApplications = async () => {
            try {
                const res = await axiosInstance.get(`/applications/job/${selectedJob}`);
                setApplications(res.data.applications || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchApplications();
    }, [selectedJob, token]);

    const handleStatusChange = async (id, status) => {
        await axiosInstance.patch(`/applications/${id}`, { status });
        setApplications((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
    };

    return (
        <div>
            <h2>Employer Dashboard</h2>
            {loading ? <div className="loader">Loading...</div> : null}
            <div className="card mt">
                <h3>My Jobs</h3>
                <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                    {jobs.map((job) => (
                        <option key={job._id} value={job._id}>{job.title}</option>
                    ))}
                </select>
            </div>
            <div className="card mt">
                <h3>Applications Received</h3>
                {applications.length === 0 ? <p className="muted">No applications yet.</p> : null}
                {applications.map((app) => (
                    <div key={app._id} className="panel mt">
                        <div className="row">
                            <strong>{app.candidateId?.name}</strong>
                            <span className={`status ${app.status}`}>{app.status}</span>
                        </div>
                        <p className="muted">Resume: {app.resume}</p>
                        <select value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployerDashboard;
