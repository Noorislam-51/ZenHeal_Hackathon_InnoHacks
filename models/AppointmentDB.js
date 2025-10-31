  const mongoose = require('mongoose');


  const prescriptionSchema = new mongoose.Schema({
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String }, // e.g. "1 tablet twice a day"
        duration: { type: String }, // e.g. "5 days"
        notes: { type: String } // optional note for the pharmacist/patient
      }
    ],
    instructions: { type: String }, // general advice
    prescribedAt: { type: Date, default: Date.now },
    sentToPharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      default: null
    }
  });

  const appointmentSchema = new mongoose.Schema({
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    health_worker_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    symptoms: {
      type: String
    },
    category: {
      type: String,
      enum: ['General', 'Fever', 'Injury', 'Eye', 'Skin', 'Maternal', 'Other'],
      required: true
    },
    audioNote: {
      type: String // stores filename or path
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    mode: {
      type: String,
      enum: ["Phone-Call", "Video-Call", "Message"],
      default: 'Video-Call'
    }, 
    prescription: prescriptionSchema, // 🩺 new field
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  const Appointment = mongoose.model('Appointment', appointmentSchema, "appointments");
  module.exports = Appointment;
