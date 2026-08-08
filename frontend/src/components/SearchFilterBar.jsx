import { useState } from 'react';

const initialFilterState = { search: '', location: '', skills: '', minSalary: '', maxSalary: '' };

const SearchFilterBar = ({ onFilter }) => {
    const [filters, setFilters] = useState(initialFilterState);

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters(initialFilterState);
        onFilter(initialFilterState);
    };

    const isFiltered = Object.values(filters).some((val) => val.trim() !== '');

    return (
        <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
                <div className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <span>🔍</span> Search & Filter Jobs
                </div>
                {isFiltered && (
                    <span className="badge text-[11px]">Filters Active</span>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Search Keywords</label>
                        <input
                            className="input-field"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Title, role, or company..."
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</label>
                        <input
                            className="input-field"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            placeholder="City, State, or Remote..."
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Skills</label>
                        <input
                            className="input-field"
                            value={filters.skills}
                            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                            placeholder="React, Node, Figma..."
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Min Salary ($)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={filters.minSalary}
                            onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                            placeholder="e.g. 40000"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Max Salary ($)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={filters.maxSalary}
                            onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                            placeholder="e.g. 100000"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {isFiltered && (
                        <button type="button" className="btn btn-secondary" onClick={handleReset}>
                            🔄 Reset Filters
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                        🔍 Apply Filters
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchFilterBar;
