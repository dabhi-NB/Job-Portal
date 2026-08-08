import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import SearchFilterBar from '../components/SearchFilterBar';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchJobs = async (filters = {}) => {
        setLoading(true);
        setError('');
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
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-8 md:p-10 mb-6 shadow-xl shadow-indigo-500/20">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">Find Your Next Career Opportunity</h1>
                <p className="text-indigo-100 text-base max-w-2xl">Browse thousands of job postings, apply easily with your resume, and track application status in real-time.</p>
            </div>

            <SearchFilterBar onFilter={fetchJobs} />

            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Available Job Opportunities</h2>
                {!loading && (
                    <span className="badge text-xs px-3 py-1">
                        {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
                    </span>
                )}
            </div>

            {loading && <Loader message="Fetching latest jobs..." />}
            <ErrorMessage message={error} />

            {!loading && jobs.length === 0 && (
                <div className="card text-center py-12 px-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Jobs Match Your Criteria</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Try adjusting your search keywords, location, or resetting filters to see more results.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    );
};

export default Home;
