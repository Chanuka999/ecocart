import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth/auth-routes.js";
dotenv.config();

// Enhanced MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    // console.log("Attempting to connect to MongoDB...");
    // console.log(
    //   "Using connection:",
    //   connectionString.includes("localhost") ? "Local MongoDB" : "MongoDB Atlas"
    // );

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:");
    console.error("Error:", error.message);

    if (error.message.includes("IP") || error.message.includes("ENOTFOUND")) {
      console.log("\n🔧 SOLUTIONS:");
      console.log("For Atlas: Add IP 192.248.64.218 to Network Access");
      console.log("For Local: Install MongoDB locally or use MongoDB Compass");
      console.log("For Testing: Use a different connection string in .env");
    }

    // Don't exit the process, let the server run without DB
    console.log("⚠️  Server will continue running without database connection");
  }
};

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
