const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Health Worker Schema
const hwSchema = new mongoose.Schema({
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
  email: { type: String, required: true, unique: true, lowercase: true },
  location: {type:String}
}, 
{ timestamps: true }
);

// Use email as login username
hwSchema.plugin(plm, { usernameField: "email" });

const HealthWorker = mongoose.model("HealthWorker", hwSchema,"health_workers");
module.exports = HealthWorker;
