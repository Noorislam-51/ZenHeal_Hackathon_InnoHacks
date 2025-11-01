var express = require('express');
var router = express.Router();

const Appointment = require('../models/AppointmentDB');


router.get('/login/doctor', function(req, res, next) {
  res.render('./auth/doctor_auth.ejs');
});


router.get('/doctor/dashboard', function(req, res, next) {
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/login');
  // }
  console.log("Patient Data")
  console.log(req.user);           // Entire patient object
  console.log(req.user._id);       // ✅ Patient's MongoDB ID
  console.log(req.user.fullName); 
  res.render('./doctor/dashboard',{"user":req.user});
});


router.get('/doctor/patients', async function(req,res,next){
  const pendingAppointments = await Appointment.find({ status: "Pending" }).lean();
  console.log(pendingAppointments)
  data = {"appointments":pendingAppointments}
  res.render('./doctor/patient_req',{data})
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


router.get('/doctor/prescriptions',function(req,res,next){
  // In your Express route
  res.render('./doctor/prescription.ejs', {
    doctor: {
        name: 'Dr. Ali Atiyab Husain',
        role: 'General Practitioner'
    },
    notificationCount: 3,
    prescriptions: [
        {
            id: 'presc_001',
            patientName: 'Meera Singh',
            date: '30 Oct 2025',
            status: 'Active',
            medicines: [
                'Amoxicillin 500mg - 3x daily',
                'Paracetamol 500mg - 2x daily'
            ],
            notes: 'Complete the full course of antibiotics'
        },
        {
            id: 'presc_002',
            patientName: 'Suresh Reddy',
            date: '29 Oct 2025',
            status: 'Active',
            medicines: [
                'Metformin 500mg - 2x daily',
                'Atorvastatin 10mg - 1x daily'
            ],
            notes: 'Take with meals. Monitor blood sugar levels regularly'
        }
    ]
});
})



module.exports = router;