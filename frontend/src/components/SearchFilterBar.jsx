import { useState } from 'react';

const SearchFilterBar = ({ onFilter }) => {
    const [filters, setFilters] = useState({ search: '', location: '', skills: '', minSalary: '', maxSalary: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    return (
        <form className="card" onSubmit={handleSubmit}>
            <div className="grid grid-2">
                <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search title or company" />
                <input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="Location" />
                <input value={filters.skills} onChange={(e) => setFilters({ ...filters, skills: e.target.value })} placeholder="Skills" />
                <div className="row">
                    <input value={filters.minSalary} onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })} placeholder="Min salary" />
                    <input value={filters.maxSalary} onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })} placeholder="Max salary" />
                </div>
            </div>
            <button className="primary mt" type="submit">Apply Filters</button>
        </form>
    );
};

export default SearchFilterBar;
