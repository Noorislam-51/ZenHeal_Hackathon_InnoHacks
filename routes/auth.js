const express = require('express');
const passport = require('passport');
const Doctor = require('../models/DoctorDB');
const Patient = require('../models/PatientDB');
const Pharmacy= require('../models/PharmacyDB'); 

const router = express.Router();

// -------------------- PATIENT AUTH --------------------

// ✅ Render Patient Login Page
router.get('/login/patient', (req, res) => {
  res.render('auth/patient_auth'); // ensure views/auth/patient_auth.ejs exists
});

// ✅ Patient Registration
router.post('/register/patient', async (req, res) => {
  try {
    const { fullName, patientId, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/login/patient');
    }

    const existingPatient = await Patient.findOne({ $or: [{ patientId }, { email }] });
    if (existingPatient) {
      req.flash('error', 'Patient ID or Email already exists.');
      return res.redirect('/login/patient');
    }

    const newPatient = new Patient({ fullName, patientId, email, phone });
    await Patient.register(newPatient, password);

    req.flash('success', 'Patient account created successfully. Please log in.');
    res.redirect('/patient/dashboard'); // ✅ redirect to correct page
  } catch (err) {
    console.error('❌ Patient Registration Error:', err);
    req.flash('error', 'Error creating patient account. Try again.');
    res.redirect('/login/patient');
  }
});

// ✅ Patient Login
router.post(
  '/login/patient',
  passport.authenticate('Patient-local', {
    failureRedirect: '/login/patient',
    failureFlash: 'Invalid Patient ID or Password',
  }),
  (req, res) => {
    req.flash('success', 'Patient login successful!');
    res.redirect('/patient/dashboard');
  }
);

// -------------------- DOCTOR AUTH --------------------

// ✅ Render Doctor Login Page
router.get('/login/doctor', (req, res) => {
  res.render('auth/doctor_auth'); // ensure views/auth/doctor_auth.ejs exists
});

// ✅ Doctor Registration
router.post('/register/doctor', async (req, res) => {
  try {
    const { fullName, doctorId, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/login/doctor');
    }

    const existingDoctor = await Doctor.findOne({ $or: [{ doctorId }, { email }] });
    if (existingDoctor) {
      req.flash('error', 'Doctor ID or Email already exists.');
      return res.redirect('/login/doctor');
    }

    const newDoctor = new Doctor({ fullName, doctorId, email, phone });
    await Doctor.register(newDoctor, password);

    req.flash('success', 'Doctor account created successfully. Please log in.');
    res.redirect('/patient/dashboard'); // ✅ redirect to correct page
  } catch (err) {
    console.error('❌ Doctor Registration Error:', err);
    req.flash('error', 'Error creating doctor account. Try again.');
    res.redirect('/login/doctor');
  }
});

// ✅ Doctor Login
router.post(
  '/login/doctor',
  passport.authenticate('Doctor-local', {
    failureRedirect: '/login/doctor',
    failureFlash: 'Invalid Doctor ID or Password',
  }),
  (req, res) => {
    req.flash('success', 'Doctor login successful!');
    res.redirect('/patient/dashboard');
  }
);


// -------------------- PHARMACY AUTH --------------------
// ✅ Render Pharmacy Login Page
router.get('/login/pharmacy', (req, res) => {
  res.render('auth/pharmacy_auth'); // make sure views/auth/pharmacy_auth.ejs exists
});

// ✅ Pharmacy Registration
router.post('/register/pharmacy', async (req, res) => {
  try {
    const { storeName, storeId, email, phone, ownerName, password, confirmPassword } = req.body;

    // Check password match
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/login/pharmacy');
    }

    // Check if store ID or email already exists
    const existingStore = await Pharmacy.findOne({ $or: [{ storeId }, { email }] });
    if (existingStore) {
      req.flash('error', 'Store ID or Email already exists.');
      return res.redirect('/login/pharmacy');
    }

    // Create new store and register with Passport-Local-Mongoose
    const newStore = new Pharmacy({ storeName, storeId, email, phone, ownerName });
    await Pharmacy.register(newStore, password);

    req.flash('success', 'Pharmacy account created successfully. Please log in.');
    res.redirect('/patient/dashboard');
  } catch (err) {
    console.error('❌ Pharmacy Registration Error:', err);
    req.flash('error', 'Error creating pharmacy account. Try again.');
    res.redirect('/login/pharmacy');
  }
});

// ✅ Pharmacy Login
router.post(
  '/login/pharmacy',
  passport.authenticate('Pharmacy-local', {
    failureRedirect: '/login/pharmacy',
    failureFlash: 'Invalid Store ID or Password',
  }),
  (req, res) => {
    req.flash('success', 'Pharmacy login successful!');
    res.redirect('/patient/dashboard'); // redirect to pharmacy dashboard or landing page
  }
);
// -------------------- LOGOUT --------------------
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
  });
});

module.exports = router;
