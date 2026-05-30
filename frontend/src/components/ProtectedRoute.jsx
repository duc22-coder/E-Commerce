import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle Unauthenticated State
  if (!isAuthenticated) {
    // Redirect to login, but save the attempted url so we can return them here later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle Forbidden State (Logged in, but not an admin)
  if (adminOnly && !isAdmin) {
    console.warn("Forbidden access attempt. User is not an admin.");
    return <Navigate to="/" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;
