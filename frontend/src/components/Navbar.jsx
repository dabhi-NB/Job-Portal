import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const navLinkClass = ({ isActive }) =>
        `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`;

    return (
        <nav className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm gap-3">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-indigo-600 dark:text-indigo-400 no-underline">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/30">
                    J
                </div>
                <span>JobPortal</span>
            </Link>

            <div className="flex items-center gap-2 flex-wrap justify-center">
                <NavLink to="/" className={navLinkClass}>
                    Browse Jobs
                </NavLink>

                {user?.role === 'employer' && (
                    <>
                        <NavLink to="/post-job" className={navLinkClass}>
                            Post Job
                        </NavLink>
                        <NavLink to="/employer-dashboard" className={navLinkClass}>
                            Dashboard
                        </NavLink>
                    </>
                )}

                {user?.role === 'candidate' && (
                    <NavLink to="/candidate-dashboard" className={navLinkClass}>
                        My Applications
                    </NavLink>
                )}

                {!user ? (
                    <>
                        <NavLink to="/login" className={navLinkClass}>
                            Login
                        </NavLink>
                        <NavLink to="/register" className={navLinkClass}>
                            Register
                        </NavLink>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                                {getInitial(user.name)}
                            </div>
                            <span>{user.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] capitalize font-bold">
                                {user.role}
                            </span>
                        </div>
                        <button
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                            onClick={handleLogout}
                            title="Logout of account"
                        >
                            <span>🚪</span> Logout
                        </button>
                    </>
                )}

                <button
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center text-lg shadow-sm hover:border-indigo-500 hover:scale-105 transition-all cursor-pointer"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
