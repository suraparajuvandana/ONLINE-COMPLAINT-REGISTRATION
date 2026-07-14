import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';
import '../assets/css/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'agent' ? '/agent' : '/dashboard';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span>CMS</span>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to={dashboardPath}>Dashboard</Link>
            <Notification />
            <div className="navbar-user">
              <span>{user?.name}</span>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
