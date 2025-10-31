const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Patient Schema
const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  location: {type:String},
  gender: {type:String},
}, 
{ timestamps: true }
);

// Use email as login username
patientSchema.plugin(plm, { usernameField: "email" });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
