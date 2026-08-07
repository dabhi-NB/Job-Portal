import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axiosInstance.get('/applications/my');
                setApplications(res.data.applications || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchApplications();
    }, [token]);

    return (
        <div>
            <h2>My Applications</h2>
            {applications.length === 0 ? <p className="muted">You have not applied to any jobs yet.</p> : null}
            {applications.map((app) => (
                <div key={app._id} className="card mt">
                    <div className="row">
                        <h3>{app.jobId?.title}</h3>
                        <span className={`status ${app.status}`}>{app.status}</span>
                    </div>
                    <p className="muted">{app.jobId?.company} • {app.jobId?.location}</p>
                    <p>Resume: {app.resume}</p>
                </div>
            ))}
        </div>
    );
};

export default CandidateDashboard;
