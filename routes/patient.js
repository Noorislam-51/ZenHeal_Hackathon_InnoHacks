var express = require('express');
var router = express.Router();


router.get('/login/patient', function(req, res, next) {
  res.render('./auth/patient_auth.ejs');
});

router.get('/patient/dashboard', function(req, res, next) {
  console.log("Patient Data")
  console.log(req.user);           // Entire patient object
  console.log(req.user._id);       // ✅ Patient's MongoDB ID
  console.log(req.user.fullName); 
  res.render('./patient/dashboard',{"user":req.user});
});

router.get('/patient/consultation', function(req, res, next) {
  res.render('./patient/consultation');
});

router.get('/patient/prescriptionNoor', function(req, res, next) {
  res.render('./patient/prescription');
});

router.get('/patient/add_patient', function(req, res, next) {
  res.render('./patient/add_patient');
});

module.exports = router;