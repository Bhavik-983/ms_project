// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  // Get auth state from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Otherwise, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;