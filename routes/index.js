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


router.get('/doctor/dashboard', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  console.log("Patient Data")
  console.log(req.user);           // Entire patient object
  console.log(req.user._id);       // ✅ Patient's MongoDB ID
  console.log(req.user.fullName); 
  res.render('./doctor/dashboard',{"user":req.user});
});

router.get('/doctor/patients', function(req,res,next){
  res.render('./doctor/patient_req')
})

router.get('/pharmacy', function(req,res,next){
  res.render('./pharmacy/pharmacyDashboard.ejs')
})


router.get('/doctor/appointments',function(req,res,next){
  data = {
    doctor: {
        name: 'Dr. Ali Atiyab Husain',
        role: 'General Practitioner'
    },
    notificationCount: 3,
    upcomingAppointments: [
        {
            patientName: 'Ramesh Kumar',
            type: 'video',
            date: '30 Oct 2025',
            time: '10:00 AM',
            reason: 'Follow-up consultation'
        },
        {
            patientName: 'Priya Sharma',
            type: 'inperson',
            date: '30 Oct 2025',
            time: '2:30 PM',
            reason: 'General checkup'
        },
        {
            patientName: 'Anil Patel',
            type: 'video',
            date: '30 Oct 2025',
            time: '4:00 PM',
            reason: 'Prescription renewal'
        }
    ],
    pastAppointments: [
        {
            patientName: 'Meera Singh',
            date: '29 Oct 2025',
            time: '11:00 AM'
        }
    ]
}
  res.render('./doctor/appointments',data)
})
module.exports = router;
