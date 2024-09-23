import React, { useState } from 'react';
import axios from 'axios';

const Patients = () => {
  const [patientData, setPatientData] = useState({
    uid: '',
    name: '',
    age: '',
    gender: '',
    otherFields: {}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/patients', patientData);
      console.log('Patient added successfully:', response.data);
      // Clear form or show success message
    } catch (error) {
      console.error('Error adding patient:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="uid" placeholder="UID" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" name="otherFields[address]" placeholder="Address" onChange={handleChange} />
        <input type="text" name="otherFields[email]" placeholder="Email" onChange={handleChange} />
        <input type="text" name="otherFields[phone]" placeholder="Phone" onChange={handleChange} />
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

export default Patients;
