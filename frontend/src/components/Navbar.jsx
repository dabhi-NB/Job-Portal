import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div>
                <Link to="/">Job Portal</Link>
                {user?.role === 'employer' && (
                    <>
                        <Link to="/post-job">Post Job</Link>
                        <Link to="/employer-dashboard">Dashboard</Link>
                    </>
                )}
                {user?.role === 'candidate' && <Link to="/candidate-dashboard">My Applications</Link>}
            </div>
            <div>
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
