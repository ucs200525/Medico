// src/pages/Prescriptions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrescriptionList from '../components/PrescriptionList';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Prescriptions = ({ uid }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [formData, setFormData] = useState({
    medication: '',
    uid: uid, // Initialize uid from props
    date: ''
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get('/api/prescriptions/by-uid/:uid');
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      }
    };

    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (editingPrescription) {
      setFormData({
        medication: editingPrescription.medication,
        uid: editingPrescription.uid,
        date: new Date(editingPrescription.date).toISOString().split('T')[0]
      });
    }
  }, [editingPrescription]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPrescription) {
      try {
        await axios.put(`http://localhost:4000/api/prescriptions/by-uid/:uid`, formData);
        setPrescriptions(prescriptions.map(prescription =>
          prescription._id === editingPrescription._id ? { ...prescription, ...formData } : prescription
        ));
        setEditingPrescription(null);
        setFormData({
          medication: '',
          uid: '', // Resetting uid field
          date: ''
        });
      } catch (error) {
        console.error('Error updating prescription:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:4000/api/prescriptions/by-uid', formData);
        setPrescriptions([...prescriptions, formData]);
        setFormData({
          medication: '',
          uid: '', // Resetting uid field
          date: ''
        });
      } catch (error) {
        console.error('Error adding prescription:', error);
      }
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/prescriptions/by-uid/:uid`);
      setPrescriptions(prescriptions.filter(prescription => prescription._id !== id));
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  return (
    <div>
      <h1>Manage Prescriptions</h1>
      <PrescriptionList onPrescriptionEdit={handleEdit} onPrescriptionDelete={handleDelete} prescriptions={prescriptions} />
      <form onSubmit={handleSubmit}>
        <h2>{editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}</h2>
        <input
          type="text"
          name="medication"
          value={formData.medication}
          onChange={handleInputChange}
          placeholder="Medication"
          required
        />
        <input
          type="text"
          name="uid" // Now it will hold the UID value
          value={formData.uid}
          onChange={handleInputChange}
          placeholder="Patient UID"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingPrescription ? 'Update Prescription' : 'Add Prescription'}</button>
      </form>
    </div>
  );
};

export default Prescriptions;
