import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGO_URI is not defined in the environment variables"
      );
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(
      `MongoDB connected successfully: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      `MongoDB connection error: ${error.message}`
    );

    process.exit(1);
  }
};

export default connectDB;