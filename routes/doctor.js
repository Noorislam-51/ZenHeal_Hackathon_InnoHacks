var express = require('express');
var router = express.Router();


const Appointment = require('../models/AppointmentDB');


router.get('/login/doctor', function(req, res, next) {
  res.render('./auth/doctor_auth.ejs');
});


router.get('/doctor/dashboard', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login/doctor');
  }
  console.log("Patient Data")
  console.log(req.user);           // Entire patient object
  console.log(req.user._id);       // ✅ Patient's MongoDB ID
  console.log(req.user.fullName); 
  res.render('./doctor/dashboard',{"user":req.user});
});

// // main 
router.get('/doctor/patients', async function(req,res,next){
  const pendingAppointments = await Appointment.find({ status: "Pending" }).populate('patient_id');
  console.log("Pending Appointments : ",pendingAppointments)
  data = {"appointments":pendingAppointments}
  res.render('./doctor/patient_accept',{data})
}) ;
// // main

// router.post('/doctor/accept/:id', async (req, res) => {
//   try {
//     const { scheduleDate, scheduleTime } = req.body;
//     const id = req.params.id;

//     const result = await Appointment.findByIdAndUpdate(id, {
//       status: 'Accepted',
//       scheduledAt: { date: scheduleDate, time: scheduleTime }
//     });

//     if (!result) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     console.log(`✅ Appointment ${id} accepted at ${scheduleDate} ${scheduleTime}`);
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to accept appointment' });
//   }
// });
// *************************************************************
// router.get('/doctor/patients', async function (req, res, next) {
//   try {
//     // Fetch appointments from DB
//     const pendingAppointments = await Appointment.find({ status: "Pending" }).populate('patient_id');

//     // If no appointments found, add fake data for testing
//     let data;
//     if (pendingAppointments.length === 0) {
//       const fakeAppointments = [
//         {
//           _id: "fake1",
//           date: "2025-11-01",
//           time: "10:30 AM",
//           reason: "Fever and cold",
//           status: "Pending",
//           patient_id: {
//             _id: "patient1",
//             name: "Amit Kumar",
//             age: 32,
//             gender: "Male",
//             phone: "9876543210",
//           },
//         },
//         {
//           _id: "fake2",
//           date: "2025-11-02",
//           time: "02:00 PM",
//           reason: "Headache and dizziness",
//           status: "Pending",
//           patient_id: {
//             _id: "patient2",
//             name: "Priya Sharma",
//             age: 28,
//             gender: "Female",
//             phone: "9876501234",
//           },
//         },
//       ];

//       console.log("✅ Using fake appointments data");
//       data = { appointments: fakeAppointments };
//     } else {
//       data = { appointments: pendingAppointments };
//     }

//     console.log(data);
//     res.render('./doctor/patient_accept', { data });
//   } catch (error) {
//     console.error("Error fetching doctor patients:", error);
//     res.status(500).send("Server error");
//   }
// });
// *************************************************


router.get('/doctor/accepted', async function (req, res, next) {
  try {
    // ✅ Fetch accepted appointments from DB
    const acceptedAppointments = await Appointment.find({ status: "Accepted" }).populate('patient_id');

    let data;
    if (acceptedAppointments.length === 0) {
      // ✅ Use fake data for testing
      const fakeAppointments = [
        {
          _id: "fake1",
          date: "2025-11-01",
          time: "10:30 AM",
          reason: "Fever and cold",
          status: "Accepted",
          patient_id: {
            _id: "patient1",
            name: "Amit Kumar",
            age: 32,
            gender: "Male",
            phone: "9876543210",
          },
        },
        {
          _id: "fake2",
          date: "2025-11-02",
          time: "02:00 PM",
          reason: "Headache and dizziness",
          status: "Accepted",
          patient_id: {
            _id: "patient2",
            name: "Priya Sharma",
            age: 28,
            gender: "Female",
            phone: "9876501234",
          },
        },
      ];

      console.log("✅ Using fake accepted appointments data");
      data = { appointments: fakeAppointments };
    } else {
      // ✅ Use DB data
      data = { appointments: acceptedAppointments };
    }

    console.log("✅ Accepted Appointments:", data);
    res.render('./doctor/accept_patientRough', { data });
  } catch (error) {
    console.error("Error fetching accepted appointments:", error);
    res.status(500).send("Server error");
  }
});

// 📍 POST to accept appointment
// ✅ Accept appointment route

router.post('/doctor/accept/:id', async (req, res) => {
  try {
    console.log(req.body)
    const { scheduleDate, scheduleTime } = req.body;
    console.log(scheduleDate,scheduleTime)
    const appointmentId = req.params.id;
    const doctor_id = req.user.id;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'Accepted',
        scheduledAt: { date: scheduleDate, time: scheduleTime },
        assignedDoctorId: doctor_id
      },
      { new: true }
    ).populate('patient_id');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }


    console.log("Updated Appointment : ",appointment)
    // ✅ Build WhatsApp message
    const phone = appointment.patient_id.phone; // e.g. 9876543210 (no +91 here)
    const text = encodeURIComponent(
      `Hello ${appointment.patient_id.fullName}, your appointment has been accepted by the doctor!
🗓️ Date: ${scheduleDate}
🕒 Time: ${scheduleTime}
📍 Mode: ${appointment.mode || 'In-person'}

Thank you for using ZenHeal!`
    );

    // ✅ Create WhatsApp link
    const whatsappLink = `https://wa.me/${phone}?text=${text}`;

    console.log(`✅ Appointment ${appointmentId} accepted — WhatsApp link: ${whatsappLink}`);

    // Return the link to frontend
    res.redirect('/doctor/patients')
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept appointment' });
  }
});



router.get('/doctor/appointments',async(req,res,next)=>{
  doctor_id = req.user.id;
  const acceptedAppointments = await Appointment.find({ status: "Accepted",
    assignedDoctorId:doctor_id }).populate('patient_id');
  let upcomingAppointments = [];
  let pastAppointments = [];
  acceptedAppointments.forEach(ele=>{
    const scheduledDateTime = new Date(`${ele.scheduledAt.date}T${ele.scheduledAt.time}:00`);

    // Get current date & time
    const now = new Date();

    // Compare them
    if (now > scheduledDateTime) {
      pastAppointments.push(ele);
    } else if (now < scheduledDateTime) {
      console.log('🕒 The scheduled time is in the future');
      upcomingAppointments.push(ele)
    } else {
      console.log('🎯 It’s happening right now!');
    }
  })
  console.log("Accepted Appointments : ",acceptedAppointments)
  

  res.render('./doctor/appointments',{upcomingAppointments:upcomingAppointments,
    pastAppointments:pastAppointments})
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

router.get('/doctor/profile',function(req,res,next){
    res.render('./doctor/profile', {
    notificationCount: 3,
    profile: {
        fullName: 'Ali Atiyab Husain',
        initials: 'AA', // First letters of first and last name
        specialization: 'General Practitioner',
        email: 'dr.ali@zenheal.com',
        phone: '+91 98765 43210',
        clinicLocation: 'Rampur Rural Health Center',
        medicalLicense: 'MCI-12345678'
    }
});
})

module.exports = router;