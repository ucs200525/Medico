import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(''); // State for UID

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setUid(localStorage.getItem('uid') || ''); // Retrieve UID from local storage
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid'); // Remove UID from local storage
    setIsLoggedIn(false);
    setUid(''); // Reset UID
  };

  const setUidContext = (newUid) => {
    setUid(newUid);
    localStorage.setItem('uid', newUid); // Store UID in local storage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, uid, setUidContext }}>
      {children}
    </AuthContext.Provider>
  );
};
