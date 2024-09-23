const express = require('express');
const Patient = require('../models/Patients');
const router = express.Router();
const logger = require('../utils/logger');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');



// @route   POST /api/patients
// @desc    Add a new patient
// @access  Private (Admin)
router.post('/', async (req, res) => {
  const { uid, name, age, gender, otherFields } = req.body;

  try {
    const newPatient = new Patient({ uid, name, age, gender, otherFields });
    await newPatient.save();
    logger.info(`New patient added: ${uid}`);
    res.status(201).json(newPatient);
  } catch (err) {
    logger.error('Error adding patient:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// @route   GET /api/patients/:uid
// @desc    Get patient profile by UID
// @access  Private (Admin)
router.get('/:uid', async (req, res) => {
  try {
    const patient = await Patient.findOne({ uid: req.params.uid });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    logger.error('Error fetching patient by UID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   PUT /api/patients/:uid
// @desc    Update a patient by UID
// @access  Private (Admin)
router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const update = req.body;

    // Find the patient by UID and update the specific field(s)
    const updatedPatient = await Patient.findOneAndUpdate(
      { uid },
      { $set: update }, // Use $set to update only the provided fields
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


/*
// @route   PUT /api/patients/:id
// @desc    Update patient details by ID
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (err) {
    logger.error('Error updating patient:', err);
    res.status(500).json({ message: 'Server error' });
  }
});*/

// @route   DELETE /api/patients/:id
// @desc    Delete patient by ID
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    logger.error('Error deleting patient:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// @route   POST /api/patients/verify-uid
// @desc    Verify user UID
// @access  Public
router.post('/verify-uid', async (req, res) => {
  const { uid } = req.body;

  try {
    const patient = await Patient.findOne({ uid });
    if (!patient) {
      logger.warn(`UID verification failed: UID ${uid} not found`);
      return res.status(404).json({ message: 'UID not found' });
    }

    logger.info(`UID verified: ${uid}`);
    
    // Assuming the patient object includes a role and a token for the admin
    const token = jwt.sign({ id: patient._id, role: patient.role }, JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(200).json({
      token,
      role: patient.role,
      uid: patient.uid // or however you store the UID
    });
  } catch (error) {
    logger.error(`Error during UID verification: ${error.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
