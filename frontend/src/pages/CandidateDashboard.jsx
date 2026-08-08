import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axiosInstance.get('/applications/my');
                setApplications(res.data.applications || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <Loader message="Fetching your submitted applications..." />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Submitted Applications</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Track the status of jobs you have applied for.</p>
                </div>
                <Link to="/" className="btn btn-primary">
                    🔍 Browse More Jobs
                </Link>
            </div>

            <ErrorMessage message={error} />

            {applications.length === 0 ? (
                <div className="card text-center py-12 px-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Applications Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        You haven't applied to any job postings. Browse available opportunities and submit your resume!
                    </p>
                    <Link to="/" className="btn btn-primary mt-4">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {applications.map((app) => (
                        <div key={app._id} className="card">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{app.jobId?.title || 'Job Listing'}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                                        🏢 <strong className="text-slate-800 dark:text-slate-200">{app.jobId?.company}</strong> • 📍 {app.jobId?.location}
                                    </p>
                                </div>
                                <span className={`status-badge status-${app.status}`}>
                                    {app.status === 'pending' && '⏳ Pending'}
                                    {app.status === 'accepted' && '✅ Accepted'}
                                    {app.status === 'rejected' && '❌ Rejected'}
                                </span>
                            </div>

                            <div className="panel mt-3 text-sm">
                                <strong className="text-slate-800 dark:text-slate-200">📄 Submitted Resume Document / Link:</strong>
                                <p className="text-slate-600 dark:text-slate-300 mt-1 break-all font-semibold">
                                    {app.resume}
                                </p>
                                {app.message && (
                                    <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-300 dark:border-slate-700">
                                        <strong className="text-slate-800 dark:text-slate-200">💬 Your Message to Employer:</strong>
                                        <p className="text-slate-600 dark:text-slate-300 mt-0.5 italic text-xs">"{app.message}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80">
                                <span className="text-slate-400 dark:text-slate-500 text-xs">
                                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                                {app.jobId?._id && (
                                    <Link to={`/jobs/${app.jobId._id}`} className="btn btn-secondary text-xs px-3 py-1">
                                        View Job Posting →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
