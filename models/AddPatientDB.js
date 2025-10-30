const mongoose = require('mongoose');

const addPatientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  village: {
    type: String,
    required: true
  },
  contact: {
    type: String
  },
  symptoms: {
    type: String
  },
  category: {
    type: String,
    enum: ['General', 'Fever', 'Injury', 'Eye', 'Skin', 'Maternal', 'Other'],
    required: true
  },
  photo: {
    type: String // stores filename or path
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AddPatient = mongoose.model('AddPatient', addPatientSchema);
module.exports = AddPatient;
