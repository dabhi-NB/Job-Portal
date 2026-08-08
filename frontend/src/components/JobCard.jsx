import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="card card-interactive flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-2.5 gap-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{job.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                            🏢 <strong className="text-slate-700 dark:text-slate-300">{job.company}</strong> • 📍 {job.location}
                        </p>
                    </div>
                    <div className="salary-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <span>{job.salary ? `${job.salary.toLocaleString()}` : 'Negotiable'}</span>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 my-3 leading-relaxed">
                    {job.description}
                </p>

                <div className="mb-4">
                    {job.skills?.map((skill) => (
                        <span key={skill} className="badge">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center pt-3.5 border-t border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-400 dark:text-slate-500 text-xs">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link to={`/jobs/${job._id}`} className="btn btn-secondary px-3.5 py-1.5 text-xs">
                    View Details →
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
