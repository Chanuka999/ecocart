// Test MongoDB Atlas Connection
const mongoose = require("mongoose");
require("dotenv").config();

const testConnection = async () => {
  try {
    console.log("Testing MongoDB Atlas connection...");
    console.log("Connection string:", process.env.MONGODB_URI_ATLAS);

    await mongoose.connect(process.env.MONGODB_URI_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Atlas connection successful!");

    // Test a simple operation
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model("Test", testSchema);

    const result = await TestModel.create({ test: "connection test" });
    console.log("✅ Database write test successful:", result._id);

    await TestModel.deleteOne({ _id: result._id });
    console.log("✅ Database delete test successful");
  } catch (error) {
    console.error("❌ Atlas connection failed:");
    console.error(error.message);

    if (error.message.includes("IP")) {
      console.log("\n🔧 ACTION REQUIRED:");
      console.log("1. Go to https://cloud.mongodb.com/");
      console.log("2. Select your cluster");
      console.log("3. Go to Network Access");
      console.log("4. Add IP: 192.248.64.218");
      console.log("5. Or add 0.0.0.0/0 for development");
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

testConnection();
