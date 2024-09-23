// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import VerifyUid from './pages/VerifyUIDPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Prescriptions from './pages/Prescriptions';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import UserDataPage from './pages/UserDataPage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<VerifyUid />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-data" element={<UserDataPage />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/patients" element={<ProtectedRoute element={<Patients />} />} />
          <Route path="/prescriptions" element={<ProtectedRoute element={<Prescriptions />} />} />
          <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
