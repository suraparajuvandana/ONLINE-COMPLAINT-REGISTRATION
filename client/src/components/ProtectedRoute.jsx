import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * Guards routes based on authentication and, optionally, allowed roles.
 * Usage: <ProtectedRoute allowedRoles={['admin']} />
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
