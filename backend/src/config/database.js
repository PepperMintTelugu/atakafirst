import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ataka_bookstore";
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("📦 Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("📦 Mongoose disconnected from MongoDB");
    });

    // Handle application termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        "📦 Mongoose connection closed due to application termination",
      );
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

    // In development, don't exit - allow app to run with mock data
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log("⚠️  Running in development mode without MongoDB");
      console.log("📦 Using mock data for API responses");
      return;
    }

    // Exit process with failure in production
    process.exit(1);
  }
};

export default connectDB;
