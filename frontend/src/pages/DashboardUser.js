
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const DashboardUser = ({ uid }) => {
  const [patient, setPatient] = useState(null);
 

  useEffect(() => {
    const fetchPatientData = async () => {
      if (uid) {
        try {
          const response = await axios.get(`http://localhost:4000/api/patients/${uid}`);
          setPatient(response.data);
        } catch (error) {
          console.error('Error fetching patient:', error.response ? error.response.data : error.message);
        }
      }
    };

    fetchPatientData();
  }, [uid]);

//   // Handle updates, including for nested fields
//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith('otherFields')) {
//       const fieldName = name.split('[')[1].slice(0, -1); // e.g., 'address', 'email', 'phone'
//       setUpdatedData((prevData) => ({
//         ...prevData,
//         otherFields: {
//           ...prevData.otherFields,
//           [fieldName]: value,
//         },
//       }));
//     } else {
//       setUpdatedData({ ...updatedData, [name]: value });
//     }
//   };

//   const handleUpdateSubmit = async (field) => {
//     try {
//       let dataToSend;

//       if (field.startsWith('otherFields.')) {
//         const nestedField = field.split('.')[1];

//         dataToSend = {
//           otherFields: {
//             ...updatedData.otherFields,
//             [nestedField]: updatedData.otherFields[nestedField],
//           },
//         };
//       } else {
//         dataToSend = { [field]: updatedData[field] };
//       }

//       const response = await axios.put(`http://localhost:4000/api/patients/${uid}`, dataToSend);
//       if (response.status === 200) {
//         alert("Updated Successfully");
//       } else {
//         Promise.reject();
//       }

//       console.log('Patient updated successfully:', response.data);
//     } catch (error) {
//       console.error('Error updating patient:', error.response ? error.response.data : error.message);
//     }
//   };

  return (
    <div>
      <h2>Patient Dashboard</h2>

      {patient && (
        <div>
          <div>
            <span>NAME: </span>
            <input type="text" name="name"  />
            {/* <button onClick={() => handleUpdateSubmit('name')}>UPDATE</button> */}
          </div>
          <div>
            <span>AGE: </span>
            <input type="number" name="age" />
            {/* <button onClick={() => handleUpdateSubmit('age')}>UPDATE</button> */}
          </div>
          <div>
            <span>GENDER: </span>
            <select name="gender" >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {/* <button onClick={() => handleUpdateSubmit('gender')}>UPDATE</button> */}
          </div>
          <div>
            <span>ADDRESS: </span>
            <input
              type="text"
              name="otherFields[address]"
              
            />
            {/* <button onClick={() => handleUpdateSubmit('otherFields.address')}>UPDATE</button> */}
          </div>
          <div>
            <span>EMAIL: </span>
            <input
              type="text"
              name="otherFields[email]"
           
            />
            {/* <button onClick={() => handleUpdateSubmit('otherFields.email')}>UPDATE</button> */}
          </div>
          <div>
            <span>PHONE: </span>
            <input
              type="text"
              name="otherFields[phone]"
           
            />
            {/* <button onClick={() => handleUpdateSubmit('otherFields.phone')}>UPDATE</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
