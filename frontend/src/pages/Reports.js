// src/pages/Reports.js
import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const fileType = e.target.files[0].type.includes('image') ? 'image' : 'pdf';
    setFileType(fileType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !name) {
      setMessage('Please provide all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('fileType', fileType);

    try {
      await axios.post('http://localhost:4000/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Report added successfully');
      setFile(null);
      setName('');
    } catch (error) {
      setMessage('Error uploading report');
      console.error('Error uploading report:', error);
    }
  };

  return (
    <div>
      <h2>Add Report</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Report Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Add Report</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Reports;
