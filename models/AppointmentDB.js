const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id:{
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  doctor_id:{
    type: mongoose.Schema.Types.ObjectId,
  },
  health_worker_id:{
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
  mode:{
    type:String,
    enum:["Phone-Call","Video-Call","Message"],
    default:'Video-Call'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema,"appointments");
module.exports = Appointment;
