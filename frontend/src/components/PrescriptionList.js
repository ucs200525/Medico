import React from 'react';

const PrescriptionList = ({ prescriptions, onPrescriptionEdit, onPrescriptionDelete }) => {
  return (
    <div>
      <h2>Prescription List</h2>
      {prescriptions.length === 0 ? (
        <p>No prescriptions available.</p>
      ) : (
        <ul>
          {prescriptions.map((prescription) => (
            <li key={prescription._id}>
              <h3>{prescription.medication}</h3>
              <p>Patient UID: {prescription.uid}</p> {/* Changed from patientId to uid */}
              <p>Date: {new Date(prescription.date).toLocaleDateString()}</p>
              <button onClick={() => onPrescriptionEdit(prescription)}>Edit</button>
              <button onClick={() => onPrescriptionDelete(prescription._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionList;
