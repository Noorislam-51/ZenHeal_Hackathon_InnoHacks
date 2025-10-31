const express = require('express');
const router = express.Router();
const Appointment = require('../models/AppointmentDB');

// ✅ GET: Prescription Page
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



// ---------------------------------------------------------------
// ===============================================================
// ✅ GET: Pharmacy Medicine Inventory
router.get('/pharmacy/dashboard', async (req, res) => {
  try {
    // Fetch all appointments that have prescriptions
    const appointments = await Appointment.find({
      'prescription.medicines': { $exists: true, $ne: [] }
    }).lean();

    // ✅ Flatten and count all prescribed medicines
    const medicineCountMap = {};

    appointments.forEach(app => {
      if (app.prescription?.medicines) {
        app.prescription.medicines.forEach(med => {
          const medName = med.name.trim();
          medicineCountMap[medName] = (medicineCountMap[medName] || 0) + 1;
        });
      }
    });

    // ✅ Convert into an array format for frontend
    let medicines = Object.keys(medicineCountMap).map(name => {
      const available = Math.floor(Math.random() * 150);
      return {
        name,
        prescribed: medicineCountMap[name],
        available,
        expiry: 'Dec 2025',
        status:
          available === 0
            ? 'out-stock'
            : available < 20
            ? 'low-stock'
            : 'available'
      };
    });

    // ✅ Add fake medicines if none found
    if (medicines.length === 0) {
      medicines = [
        { name: 'Paracetamol 500mg', prescribed: 35, available: 120, expiry: 'May 2026', status: 'available' },
        { name: 'Amoxicillin 250mg', prescribed: 20, available: 10, expiry: 'Mar 2025', status: 'low-stock' },
        // { name: 'Ibuprofen 400mg', prescribed: 40, available: 0, expiry: 'Jul 2024', status: 'out-stock' },
        // { name: 'Cough Syrup', prescribed: 15, available: 45, expiry: 'Jan 2026', status: 'available' },
        // { name: 'Vitamin D Tablets', prescribed: 28, available: 18, expiry: 'Sep 2025', status: 'low-stock' },
      ];
    }

    // ✅ Render the correct EJS file
    res.render('pharmacy/dashboard', { medicines });
  } catch (err) {
    console.error('❌ Error fetching medicines:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
