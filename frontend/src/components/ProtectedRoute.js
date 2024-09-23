// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, uid } = useContext(AuthContext);

  // Check if user is logged in and uid is verified
  if (!isLoggedIn || !uid) {
    return <Navigate to="/" />;
  }

  // Clone the element and pass the uid as a prop
  return React.cloneElement(element, { uid });
};

export default ProtectedRoute;
