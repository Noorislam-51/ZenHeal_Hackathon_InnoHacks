var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Student login
router.get('/login/patient', function(req, res, next) {
  res.render('./auth/patient_auth.ejs');
});

// Staff login
router.get('/login/doctor', function(req, res, next) {
  res.render('./auth/doctor_auth.ejs');
});

// pharmacy login
router.get('/login/pharmacy', function(req, res, next) {
  res.render('./auth/pharmacy_auth.ejs');
});
// router.get('/next', function(req, res, next) {
//   res.render('next');
// });

router.get('/patient/dashboard', function(req, res, next) {
  res.render('./patient/dashboard');
});
router.get('/patient/consultation', function(req, res, next) {
  res.render('./patient/consultation');
});
router.get('/patient/add_patient', function(req, res, next) {
  res.render('./patient/add_patient');
});



module.exports = router;
