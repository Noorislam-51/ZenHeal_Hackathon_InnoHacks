const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Patient Schema
const patientSchema = new mongoose.Schema({
  fullName: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      
    },
    village: {
      type: String
    },
    contact: {
      type: String
    },
    photo: {
    type: String // stores filename or path
  },
  email: { type: String, unique: true, lowercase: true },
  phone: { type: String },
  location: {type:String}
}, 
{ timestamps: true }
);

// Use email as login username
patientSchema.plugin(plm, { usernameField: "email" });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
