import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    // Redirect to home or login if no token
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
