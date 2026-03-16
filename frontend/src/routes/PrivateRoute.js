import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Yetkiler kontrol ediliyor..." />;
  }

  // Giriş yapmamışsa Login'e (Kayıt değil, giriş daha doğru bir yönlendirme)
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol kontrolü (Eğer sayfa admin-only ise ve kullanıcı admin değilse)
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />;
  }

  // Her şey tamamsa alt rotaları göster (App.js'deki yapı ile uyumlu)
  return <Outlet />;
};

export default PrivateRoute;