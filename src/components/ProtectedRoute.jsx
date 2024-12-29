import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/" />;
  }
  else if(location.pathname === '/login' || location.pathname === '/signup'){
    return <Outlet />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;