// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated:', isAuthenticated); // Depuração

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;