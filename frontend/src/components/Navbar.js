import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, role, uid, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    // Check if UID is present before navigating to a protected page
    if (uid) {
      navigate(path); // Navigate if UID exists
    } else {
      navigate('/verify-uid'); // Redirect to Verify UID page if UID is not set
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Hospital Management</h1>
        <ul className="nav-links">
          {isLoggedIn ? (
            <>
              <li><button onClick={() => handleNavigation('/dashboard')}>Dashboard</button></li>
              <li><button onClick={() => handleNavigation('/patients')}>Patients</button></li>
              <li><button onClick={() => handleNavigation('/prescriptions')}>Prescriptions</button></li>
              <li><button onClick={() => handleNavigation('/reports')}>Reports</button></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
