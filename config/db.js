
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Replace the URL below with your MongoDB Atlas connection string
    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // exit if DB fails to connect
  }
};

module.exports = connectDB;
