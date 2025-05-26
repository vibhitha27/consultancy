import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default AdminRoute;