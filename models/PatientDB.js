const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Patient Schema
const patientSchema = new mongoose.Schema({
   fullName: { type: String, required: true },
  patientId: { type: String, required: true, unique: true }, // used for login
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, // Doctor reference
}, 
{ timestamps: true }
);

// Use patientId as login username
patientSchema.plugin(plm, { usernameField: "patientId" });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
