import mongoose from "mongoose";

import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

export const connectDB = async () => {
  await mongoose.connect(MONGO_URI, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000,
  });
};

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  console.log("Retrying MongoDB connection in 5 seconds...");
  setTimeout(connectDB, 5000);
});

mongoose.connection.on("open", () => {
  console.log("MongoDB connected");
});

const gracefulShutdown = async () => {
  console.log("Received termination signal");
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection close error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
