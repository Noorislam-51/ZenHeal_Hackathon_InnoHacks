const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }], // linked patients
}, 
{ timestamps: true }
);

// Use doctorId as the username for authentication
doctorSchema.plugin(plm, { usernameField: "email" });

const Doctor = mongoose.model("Doctor", doctorSchema,"doctors");

module.exports = Doctor;
