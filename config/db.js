import "./env.js";
import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/lms";

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  connectionPromise = mongoose
    .connect(mongoUri)
    .then((conn) => {
      console.log("MongoDB connected");
      return conn.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

export { mongoose };
