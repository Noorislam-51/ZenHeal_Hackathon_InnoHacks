const express = require('express');
const router = express.Router();
const AddPatient = require('../models/AddPatientDB');

// GET: Appointment page
router.get('/patient/appointment', async (req, res) => {
  try {
    // Fetch patients who have assigned doctors (or modify condition as needed)
    const appointment = await AddPatient.find().populate('assignedDoctor').lean();

    // Pass appointments data to EJS
    res.render('./patient/appointment_page', { appointment });
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).send('Server Error');
  }
});

// GET: Individual appointment details
router.get('/patient/appointment/:id', async (req, res) => {
  try {
    const appointment = await AddPatient.findById(req.params.id).populate('assignedDoctor').lean();

    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.render('patient/separate_appointment', { appointment });
  } catch (err) {
    console.error('Error fetching single appointment:', err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
