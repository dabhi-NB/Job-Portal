import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);

    // File & Message state
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeUrlInput, setResumeUrlInput] = useState('');
    const [messageInput, setMessageInput] = useState('');

    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axiosInstance.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load job details');
            }
        };

        fetchJob();
    }, [id]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be under 5MB');
                return;
            }
            setSelectedFile(file);
            setResumeUrlInput('');
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isValidUrl = (str) => {
        try {
            const url = new URL(str);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const formData = new FormData();
        formData.append('jobId', id);

        if (selectedFile) {
            formData.append('resumeFile', selectedFile);
        } else if (resumeUrlInput.trim()) {
            if (!isValidUrl(resumeUrlInput.trim())) {
                setError('Please enter a valid URL starting with https:// (e.g. https://drive.google.com/resume.pdf)');
                return;
            }
            formData.append('resumeLink', resumeUrlInput.trim());
        } else {
            setError('Please upload your resume file or provide a valid resume URL');
            return;
        }

        if (messageInput.trim()) {
            formData.append('message', messageInput.trim());
        }

        setSubmitting(true);

        try {
            await axiosInstance.post('/applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMsg('Your application and resume have been submitted successfully!');
            setSelectedFile(null);
            setResumeUrlInput('');
            setMessageInput('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            await axiosInstance.delete(`/jobs/${id}`);
            navigate('/employer-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete job');
        }
    };

    const isOwner = user?.role === 'employer' && job?.postedBy?._id === user?.id;

    if (!job && !error) return <Loader message="Loading job specifications..." />;

    if (error && !job) return <ErrorMessage message={error} />;

    return (
        <div className="max-w-4xl mx-auto">
            <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
                ← Back to Jobs
            </button>

            <div className="card">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{job.title}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base mt-1.5">
                            🏢 <strong className="text-slate-800 dark:text-slate-200">{job.company}</strong> • 📍 {job.location}
                        </p>
                    </div>

                    <div className="salary-tag text-sm px-4 py-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <span>{job.salary ? `${job.salary.toLocaleString()} / year` : 'Salary Negotiable'}</span>
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Job Description</h3>
                    <p className="whitespace-pre-line leading-relaxed mt-2.5 text-slate-700 dark:text-slate-300 text-sm">
                        {job.description}
                    </p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Required Skills & Technologies</h3>
                    <div className="mt-2.5">
                        {job.skills?.map((skill) => (
                            <span key={skill} className="badge text-xs px-3.5 py-1.5">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
                    Posted by <strong className="text-slate-600 dark:text-slate-300">{job.postedBy?.name || 'Employer'}</strong> ({job.postedBy?.email}) on {new Date(job.createdAt).toLocaleDateString()}
                </div>

                {isOwner && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex-wrap gap-2">
                        <button className="btn btn-primary" onClick={() => navigate('/post-job', { state: { job } })}>
                            ✏️ Edit Job Posting
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            🗑️ Delete Job Posting
                        </button>
                    </div>
                )}
            </div>

            {user?.role === 'candidate' && (
                <div className="card">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Submit Your Job Application</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 mt-1">
                        Upload your resume file and attach an optional message to the hiring manager at <strong className="text-slate-800 dark:text-slate-200">{job.company}</strong>.
                    </p>

                    <form onSubmit={handleApply} className="flex flex-col gap-4">
                        {/* Resume File Upload Section */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                Upload Resume File (PDF / DOCX) <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                            />

                            {!selectedFile ? (
                                <div
                                    className="file-dropzone"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="text-3xl text-indigo-600 dark:text-indigo-400">📁</div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                        Click to Upload Resume Document
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                        Supports PDF, DOC, DOCX files (up to 5MB)
                                    </div>
                                </div>
                            ) : (
                                <div className="file-preview-card">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">📄</div>
                                        <div>
                                            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{selectedFile.name}</div>
                                            <div className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-600 text-lg cursor-pointer p-1"
                                        onClick={handleRemoveFile}
                                        title="Remove selected file"
                                    >
                                        ✖
                                    </button>
                                </div>
                            )}

                            {!selectedFile && (
                                <div className="mt-2.5">
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Or enter portfolio / resume URL link:</span>
                                    <input
                                        type="text"
                                        className="input-field mt-1"
                                        value={resumeUrlInput}
                                        onChange={(e) => setResumeUrlInput(e.target.value)}
                                        placeholder="https://drive.google.com/your-resume.pdf or LinkedIn profile..."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Cover Message Section */}
                        <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                Cover Message / Note to Employer <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                className="input-field"
                                rows="4"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Introduce yourself, share relevant experience, or express why you'd be a great fit for this position..."
                            />
                        </div>

                        <button className="btn btn-primary mt-2 py-3" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting Application...' : '🚀 Submit Application'}
                        </button>
                    </form>

                    {successMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg text-sm font-medium mt-3">
                            ✅ {successMsg}
                        </div>
                    )}
                    <ErrorMessage message={error} />
                </div>
            )}

            {!user && (
                <div className="card text-center bg-slate-100 dark:bg-slate-900/60">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Interested in this role?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Log in as a Candidate to submit your resume directly to the employer.</p>
                    <div className="mt-4">
                        <button className="btn btn-primary" onClick={() => navigate('/login')}>
                            Login to Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;
