import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Ensure correct path

const VerifyUIDPage = () => {
  const [uid, setUid] = useState('');
  const { login, setUidContext } = useContext(AuthContext); // Destructure from context
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/patients/verify-uid', { uid });
      console.log('UID verification successful', response);

      if (response.status === 200) {
        const patientData = response.data; // Ensure your API returns the necessary data
        localStorage.setItem('token', response.data.token); // Store token
        
        // Set UID in context
        setUidContext(uid); // This should now work

        if (patientData.role === 'admin') {
          login(); // Update logged-in state
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          navigate('/dashboardUser'); // Redirect to dashboard if user
        }
      } else {
        throw new Error('Failed to verify UID'); // Throw an error if the response is not 200
      }
    } catch (err) {
      setError(`UID verification failed. ${err.message}`);
      console.error('UID verification error:', err);
    }
  };

  return (
    <div>
      <h2>Verify UID</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Please enter UID:
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            required
          />
        </label>
        <button type="submit">Verify</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default VerifyUIDPage;
