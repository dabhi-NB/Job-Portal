import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const BACKEND_URL = 'http://localhost:5000';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApps, setLoadingApps] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get('/jobs');
                const myJobs = (res.data.jobs || []).filter(
                    (job) => job.postedBy?._id === user?.id
                );
                setJobs(myJobs);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load jobs');
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchJobs();
    }, [user]);

    useEffect(() => {
        const fetchAllApplications = async () => {
            setLoadingApps(true);
            try {
                const res = await axiosInstance.get('/applications/employer');
                setAllApplications(res.data.applications || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load applications');
            } finally {
                setLoadingApps(false);
            }
        };

        fetchAllApplications();
    }, []);

    const getAppCount = (jobId) => {
        return allApplications.filter((a) => a.jobId?._id === jobId).length;
    };

    const filteredApplications = allApplications.filter((app) => {
        const jobMatch = selectedJob === 'all' || app.jobId?._id === selectedJob;
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        return jobMatch && statusMatch;
    });

    const handleStatusChange = async (id, status) => {
        try {
            await axiosInstance.patch(`/applications/${id}`, { status });
            setAllApplications((prev) =>
                prev.map((item) => (item._id === id ? { ...item, status } : item))
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to update status');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job posting and all its applications?')) return;
        try {
            await axiosInstance.delete(`/jobs/${jobId}`);
            setJobs((prev) => prev.filter((j) => j._id !== jobId));
            setAllApplications((prev) => prev.filter((a) => a.jobId?._id !== jobId));
            if (selectedJob === jobId) setSelectedJob('all');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete job');
        }
    };

    const isFileResume = (app) => {
        return app.resumeType === 'file' || (app.resume && app.resume.startsWith('/uploads/'));
    };

    const isLinkResume = (resume) => {
        try {
            const url = new URL(resume);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const getFileName = (filePath) => {
        if (!filePath) return 'Resume';
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    };

    const [downloadingId, setDownloadingId] = useState(null);

    // Forces a real file download even across different origins (backend vs frontend port).
    // A plain <a href download> tag is ignored by browsers for cross-origin URLs,
    // so we fetch the file ourselves and trigger the download from a same-origin blob URL.
    const handleDownloadResume = async (resumePath, appId) => {
        try {
            setDownloadingId(appId);
            const response = await fetch(`${BACKEND_URL}${resumePath}`);
            if (!response.ok) throw new Error('Failed to fetch resume');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = getFileName(resumePath);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Resume download failed:', err);
            setError('Unable to download resume. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    if (loadingJobs) return <Loader message="Loading dashboard..." />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Employer Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your job listings and review candidate applications.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
                    ➕ Post New Job
                </button>
            </div>

            <ErrorMessage message={error} />

            {/* My Posted Jobs */}
            <div className="card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Posted Jobs ({jobs.length})</h3>
                </div>

                {jobs.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">You have not posted any jobs yet.</p>
                        <button className="btn btn-primary mt-3" onClick={() => navigate('/post-job')}>
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobs.map((job) => {
                            const appCount = getAppCount(job._id);
                            return (
                                <div key={job._id} className="panel flex flex-col justify-between m-0">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{job.title}</h4>
                                            <div className="salary-tag text-[11px] px-2 py-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                {job.salary ? job.salary.toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                                            📍 {job.location} • Created {new Date(job.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="mt-2.5">
                                            <span
                                                className={`status-badge cursor-pointer ${appCount > 0 ? 'status-accepted' : 'status-pending'}`}
                                                onClick={() => setSelectedJob(job._id)}
                                            >
                                                👥 {appCount} {appCount === 1 ? 'Candidate' : 'Candidates'} Applied
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80">
                                        <button className="btn btn-secondary text-xs px-3 py-1" onClick={() => navigate('/post-job', { state: { job } })}>
                                            ✏️ Edit
                                        </button>
                                        <button className="btn btn-danger text-xs px-3 py-1" onClick={() => handleDeleteJob(job._id)}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Applications Received */}
            <div className="card">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Applications Received ({allApplications.length})</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Filter by Job</label>
                        <select className="input-field" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                            <option value="all">📋 All Jobs ({allApplications.length})</option>
                            {jobs.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.title} ({getAppCount(job._id)})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Filter by Status</label>
                        <select className="input-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="accepted">✅ Accepted</option>
                            <option value="rejected">❌ Rejected</option>
                        </select>
                    </div>
                </div>

                {(selectedJob !== 'all' || statusFilter !== 'all') && (
                    <div className="flex items-center gap-3 mt-3">
                        <button className="btn btn-secondary text-xs px-3 py-1" onClick={() => { setSelectedJob('all'); setStatusFilter('all'); }}>
                            🔄 Reset Filters
                        </button>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">
                            Showing {filteredApplications.length} of {allApplications.length} applications
                        </span>
                    </div>
                )}

                {loadingApps && <Loader message="Loading candidate applications..." />}

                {!loadingApps && filteredApplications.length === 0 && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-6">
                        No applications found with the selected filters.
                    </p>
                )}

                {!loadingApps && filteredApplications.map((app) => (
                    <div key={app._id} className="panel mt-3">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">👨‍💼 {app.candidateId?.name || 'Candidate'}</strong>
                                <span className="text-slate-500 dark:text-slate-400 text-xs ml-2">
                                    ({app.candidateId?.email})
                                </span>
                            </div>
                            <span className={`status-badge status-${app.status}`}>
                                {app.status === 'pending' && '⏳ Pending'}
                                {app.status === 'accepted' && '✅ Accepted'}
                                {app.status === 'rejected' && '❌ Rejected'}
                            </span>
                        </div>

                        {selectedJob === 'all' && app.jobId && (
                            <div className="mt-1 text-xs">
                                <span className="badge">🏢 {app.jobId.title} • {app.jobId.location}</span>
                            </div>
                        )}

                        {/* Resume Section — File or Link */}
                        <div className="flex items-center gap-2.5 flex-wrap mt-2 text-sm">
                            {isFileResume(app) ? (
                                <>
                                    <span>
                                        <strong className="text-slate-800 dark:text-slate-200">📄 Resume File:</strong>{' '}
                                        <span className="text-slate-600 dark:text-slate-300 font-semibold">{getFileName(app.resume)}</span>
                                    </span>
                                    <a
                                        href={`${BACKEND_URL}${app.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary text-xs px-3 py-1"
                                    >
                                        📂 View Resume
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadResume(app.resume, app._id)}
                                        disabled={downloadingId === app._id}
                                        className="btn btn-secondary text-xs px-3 py-1 disabled:opacity-60"
                                    >
                                        {downloadingId === app._id ? '⏳ Downloading...' : '⬇️ Download'}
                                    </button>
                                </>
                            ) : isLinkResume(app.resume) ? (
                                <>
                                    <span>
                                        <strong className="text-slate-800 dark:text-slate-200">🔗 Resume Link:</strong>{' '}
                                        <span className="text-slate-600 dark:text-slate-300 font-semibold break-all">{app.resume}</span>
                                    </span>
                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary text-xs px-3 py-1"
                                    >
                                        🌐 Open Link
                                    </a>
                                </>
                            ) : (
                                <span>
                                    <strong className="text-slate-800 dark:text-slate-200">📄 Resume:</strong>{' '}
                                    <span className="text-slate-600 dark:text-slate-300 font-semibold">{app.resume}</span>
                                </span>
                            )}
                        </div>

                        {app.message && (
                            <div className="cover-message-box">
                                <strong className="text-slate-800 dark:text-slate-200">💬 Cover Message:</strong>
                                <p className="mt-1 font-normal text-slate-700 dark:text-slate-300">"{app.message}"</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80 flex-wrap gap-2">
                            <span className="text-slate-400 dark:text-slate-500 text-xs">
                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                            </span>

                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status:</label>
                                <select
                                    className="input-field w-auto py-1 px-2.5 text-xs"
                                    value={app.status}
                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                >
                                    <option value="pending">⏳ Pending</option>
                                    <option value="accepted">✅ Accepted</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployerDashboard;