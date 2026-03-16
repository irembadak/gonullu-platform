import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <LoadingSpinner message="Güvenlik kontrolü yapılıyor..." />;
  }
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;