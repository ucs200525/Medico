const express = require('express');
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const Patients = require('../models/Patients'); // Import Patients model
const router = express.Router();
const logger = require('../utils/logger');
const { authenticateToken } = require('../middleware/authMiddleware');

// Set up multer for file upload
const upload = multer({
  dest: 'uploads/', // Directory for storing uploaded files
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|jpg|jpeg|png/; // Accept various image formats
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'));
    }
  }
});

// @route   POST /api/reports/by-uid
// @desc    Upload a new report by patient UID (Admin only)
// @access  Private (Admin)
router.post('/by-uid', authenticateToken, upload.single('report'), async (req, res) => {
  const { uid } = req.body;
  const file = req.file;

  if (!file) {
    logger.warn('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Find the patient by UID
    const patient = await Patients.findOne({ uid });
    if (!patient) {
      logger.warn(`Patient not found for UID: ${uid}`);
      return res.status(404).json({ message: 'Patient not found' });
    }

    const report = new Report({
      patientId: patient._id, // Use the patient's MongoDB ObjectId
      filePath: file.path,
      fileName: file.originalname,
      fileType: file.mimetype
    });
    await report.save();
    logger.info(`New report uploaded for patient UID: ${uid}`);
    res.status(201).json(report);
  } catch (error) {
    logger.error(`Error uploading report: ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
});

// @route   PUT /api/reports/by-uid/:uid/:id
// @desc    Update a report by patient UID (Admin only)
// @access  Private (Admin)
router.put('/by-uid/:uid/:id', authenticateToken, upload.single('report'), async (req, res) => {
  const { uid, id } = req.params;
  const file = req.file;

  try {
    // Find the patient by UID
    const patient = await Patients.findOne({ uid });
    if (!patient) {
      logger.warn(`Patient not found for UID: ${uid}`);
      return res.status(404).json({ message: 'Patient not found' });
    }

    const report = await Report.findOneAndUpdate(
      { _id: id, patientId: patient._id },
      { 
        filePath: file ? file.path : undefined,
        fileName: file ? file.originalname : undefined,
        fileType: file ? file.mimetype : undefined 
      },
      { new: true }
    );

    if (!report) {
      logger.warn(`Report not found for update by UID: ${uid}`);
      return res.status(404).json({ message: 'Report not found' });
    }

    logger.info(`Report updated successfully for UID: ${uid}`);
    res.json(report);
  } catch (error) {
    logger.error(`Error updating report: ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
});

// @route   DELETE /api/reports/by-uid/:uid/:id
// @desc    Delete a report by patient UID (Admin only)
// @access  Private (Admin)
router.delete('/by-uid/:uid/:id', authenticateToken, async (req, res) => {
  const { uid, id } = req.params;

  try {
    // Find the patient by UID
    const patient = await Patients.findOne({ uid });
    if (!patient) {
      logger.warn(`Patient not found for UID: ${uid}`);
      return res.status(404).json({ message: 'Patient not found' });
    }

    const report = await Report.findOneAndDelete({ _id: id, patientId: patient._id });

    if (!report) {
      logger.warn(`Report not found for deletion by UID: ${uid}`);
      return res.status(404).json({ message: 'Report not found' });
    }

    // Optionally, remove the file from the server
    const fs = require('fs');
    fs.unlinkSync(report.filePath);

    logger.info(`Report deleted successfully for UID: ${uid}`);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting report: ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
});

// @route   GET /api/reports/by-uid/:uid
// @desc    Get all reports by patient UID (Admin only)
// @access  Private (Admin)
router.get('/by-uid/:uid', authenticateToken, async (req, res) => {
  const { uid } = req.params;

  try {
    // Find the patient by UID
    const patient = await Patients.findOne({ uid });
    if (!patient) {
      logger.warn(`Patient not found for UID: ${uid}`);
      return res.status(404).json({ message: 'Patient not found' });
    }

    const reports = await Report.find({ patientId: patient._id });

    if (!reports.length) {
      logger.warn(`No reports found for UID: ${uid}`);
      return res.status(404).json({ message: 'No reports found' });
    }

    logger.info(`Fetched reports for UID: ${uid}`);
    res.json(reports);
  } catch (error) {
    logger.error(`Error fetching reports: ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
