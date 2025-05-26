import mongoose from "mongoose";

export default async function connectToDB() {
  if (mongoose.connection.readyState > 0) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch {
    console.log("Not connected to MongoDB");
  }
}
