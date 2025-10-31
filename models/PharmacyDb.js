const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Pharmacy Store Schema
const pharmacySchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    ownerName: { type: String, required: true },
    linkedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    linkedPatient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  },
  { timestamps: true }
);

// Use storeId as login username
pharmacySchema.plugin(plm, { usernameField: "email" });

const PharmacyStore = mongoose.model("Pharmacy", pharmacySchema,"pharmacies");
module.exports = PharmacyStore;
