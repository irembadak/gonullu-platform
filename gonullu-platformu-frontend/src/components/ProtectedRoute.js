import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Sayfa yüklenirken düz yazı yerine hazırladığımız modern spinner'ı gösterelim
  if (loading) {
    return <LoadingSpinner message="Güvenlik kontrolü yapılıyor..." />;
  }

  // Kullanıcı giriş yapmamışsa login sayfasına at, ama geldiği yeri hatırla (from)
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Eğer bu rota sadece adminler içinse ve kullanıcı admin değilse ana sayfaya at
  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Her şey yolundaysa alt bileşenleri (sayfayı) göster
  return <Outlet />;
};

export default ProtectedRoute;