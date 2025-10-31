const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Pharmacy Store Schema
const pharmacySchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    ownerName: { type: String, required: true },
    stock: {
    type: Map,
    of: Number, // the quantity will always be a number
    default: {} // start with an empty stock
  }
  },
  { timestamps: true }
);

// Use email as login username
pharmacySchema.plugin(plm, { usernameField: "email" });

const PharmacyStore = mongoose.model("Pharmacy", pharmacySchema,"pharmacies");
module.exports = PharmacyStore;
