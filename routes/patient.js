var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Appointment = require('../models/AppointmentDB');
const Patient = require('../models/PatientDB')
// 🔹 Multer setup for file uploads
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

router.get('/patient/create-appointment', function(req, res, next) {
  res.render('./patient/add_patient');
});

router.post('/patient/create-appointment', upload.single('photoFile'), async (req, res) => {
  console.log("User Data: ",req.user)
  patient_id = req.user._id.toString();
  try {
    console.log(req.body);
    const newAppointment = new Appointment({
      patient_id,
      mode:req.body.mode,
      problem:req.body.problem,
      symptoms:req.body.symptoms,
      category:req.body.problemCategory      
    },{new:true});

    await newAppointment.save();

    console.log('✅ New Appointment added:', newAppointment.patient_id);
    res.status(201).json({
      message: '✅ Appointment added successfully',
      patient: newAppointment
    });
  } catch (error) {
    console.error('❌ Error saving Appointment:', error);
    res.status(500).json({
      message: '❌ Failed to add Appointment',
      error: error.message
    }); 
  }
});

router.get('/patient/prescription', async (req, res) => {
  try {
    // Fetch real prescriptions (appointments that include a prescription)
    let prescriptions = await Appointment.find({ prescription: { $exists: true, $ne: null } })
      .populate('assignedDoctor')
      .lean();

    // ✅ Dummy data if database is empty
    if (!prescriptions || prescriptions.length === 0) {
      prescriptions = [
        {
          _id: 'dummy1',
          patient_id: { name: 'Ravi Kumar' },
          assignedDoctor: { name: 'Dr. Noor Islam' },
          category: 'Fever',
          status: 'Completed',
          prescription: {
            medicines: [
              { name: 'Paracetamol 500mg', dosage: '1 tablet twice a day', duration: '5 days', notes: 'After meals' },
              { name: 'Cough Syrup', dosage: '2 tsp thrice a day', duration: '5 days', notes: 'Shake well before use' },
            ],
            instructions: 'Drink plenty of water and rest properly.',
            prescribedAt: new Date()
          },
          createdAt: new Date()
        },
        {
          _id: 'dummy2',
          patient_id: { name: 'Aisha Patel' },
          assignedDoctor: { name: 'Dr. Rajesh Sharma' },
          category: 'Injury',
          status: 'In Progress',
          prescription: {
            medicines: [
              { name: 'Pain Relief Spray', dosage: 'Apply twice daily', duration: '7 days' },
              { name: 'Ibuprofen 400mg', dosage: '1 tablet after lunch', duration: '5 days' }
            ],
            instructions: 'Avoid pressure on injured leg.',
            prescribedAt: new Date()
          },
          createdAt: new Date()
        }
      ];
    }

    // ✅ Normalize data for EJS (safe to access)
    prescriptions = prescriptions.map(p => ({
      _id: p._id,
      doctorName: p.assignedDoctor?.name || 'N/A',
      patientName: p.patient_id?.name || 'Unknown Patient',
      category: p.category || 'General',
      status: p.status || 'Pending',
      date: p.prescription?.prescribedAt
        ? new Date(p.prescription.prescribedAt).toLocaleDateString()
        : 'N/A',
      medicineNames: p.prescription?.medicines?.map(m => m.name) || [],
      medicines: p.prescription?.medicines || [],
      instructions: p.prescription?.instructions || ''
    }));

    // ✅ Render to EJS
    res.render('patient/prescription', { prescriptions });
  } catch (err) {
    console.error('❌ Error fetching prescriptions:', err);
    res.status(500).send('Server Error');
  }
});

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


router.get('/patient/profile',async(req,res,next)=>{
  patient_id = req.user._id.toString();
  const patient = await Patient.findById(patient_id)
  console.log("Patient Data : ",patient)
  res.render('patient/profile',{profile: {
        fullName: patient.fullName,
        initials: 'AA',
        email: patient.email,
        phone: patient.phone,
        location: patient.location,
        age: 19
    }})
})


router.post('/patient/profile',async(req,res,next)=>{
  console.log("In POST : ")
  console.log(req.body)
  patient_id = req.user._id.toString();
  const updatedPatient = await Patient.findByIdAndUpdate(patient_id,
    req.body
  )
  console.log("Updated Patient Data : ")
  console.log(updatedPatient)
  res.redirect('/patient/profile')
})

module.exports = router;