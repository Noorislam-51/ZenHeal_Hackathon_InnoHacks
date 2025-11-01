
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


// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const atlasURI = process.env.MONGO_URI; // MongoDB Atlas URI from .env
//     const compassURI = "mongodb://127.0.0.1:27017/village_health_portal"; // Local Compass URI

//     // Connect to Atlas (default connection)
//     const atlasConnection = await mongoose.connect(atlasURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB Atlas");

//     // Create a second connection for Compass (local)
//     const compassConnection = mongoose.createConnection(compassURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     compassConnection.on("connected", () => {
//       console.log("✅ Connected to MongoDB Compass (Local)");
//     });

//     compassConnection.on("error", (err) => {
//       console.error("❌ Compass connection error:", err);
//     });

//     // Export both connections if needed elsewhere
//     return { atlasConnection, compassConnection };
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
