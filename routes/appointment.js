const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Appointment = require('../models/AppointmentDB');

// GET: Appointment page
router.get('/patient/appointment', async (req, res) => {
  try {
    // Fetch patients who have assigned doctors (or modify condition as needed)
    const appointment = await Appointment.find().populate('assignedDoctor').lean();

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
    const appointment = await Appointment.findById(req.params.id).populate('assignedDoctor').lean();

    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.render('patient/separate_appointment', { appointment });
  } catch (err) {
    console.error('Error fetching single appointment:', err);
    res.status(500).send('Server Error');
  }
});

// ===================================
// 🔹 Multer setup for file uploads
// ===================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/images/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `patient_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ===================================
// 🔹 POST /patient/add_patient
// ===================================
router.post('/add_patient', upload.single('photoFile'), async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      village,
      contact,
      symptoms,
      category,
      otherCategory,
      photoData
    } = req.body;

    // 🧠 If category is "Other"
    const finalCategory = category === 'Other' && otherCategory ? otherCategory : category;

    let savedPhotoPath = null;

    // 1️⃣ Case 1: Base64 from camera
    if (photoData && photoData.startsWith('data:image')) {
      const base64Data = photoData.replace(/^data:image\/\w+;base64,/, '');
      const fileName = `patient_${Date.now()}.png`;
      const uploadPath = path.join(__dirname, '../public/images/uploads', fileName);

      fs.writeFileSync(uploadPath, Buffer.from(base64Data, 'base64'));
      savedPhotoPath = `/images/uploads/${fileName}`;

    // 2️⃣ Case 2: Uploaded file from system
    } else if (req.file) {
      savedPhotoPath = `/images/uploads/${req.file.filename}`;
    }

    // ===================================
    // 💾 Save new patient record
    // ===================================
    const newAppointment = new Appointment({
      fullName,
      age: Number(age),
      gender,
      village,
      contact,
      symptoms,
      category: finalCategory,
      photo: savedPhotoPath
    });

    await newAppointment.save();

    console.log('✅ New patient added:', newAppointment.fullName);
    res.status(201).json({
      message: '✅ Patient added successfully',
      patient: newPatient
    });
  } catch (error) {
    console.error('❌ Error saving patient:', error);
    res.status(500).json({
      message: '❌ Failed to add patient',
      error: error.message
    }); 
  }
});

module.exports = router;
