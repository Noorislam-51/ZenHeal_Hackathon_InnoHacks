var express = require('express');
var router = express.Router();
const Appointment = require('../models/AppointmentDB');

// pharmacy login
router.get('/login/pharmacy', function(req, res, next) {
  res.render('./auth/pharmacy_auth.ejs');
});

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

    res.render('pharmacy/dashboard', { medicines });
  } catch (err) {
    console.error('❌ Error fetching medicines:', err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
