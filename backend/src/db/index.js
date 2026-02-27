import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n MongoDB connected !! DB Host : ${connectionInstance.connection.host}`
    );
    // console.log("Connection Instance:", connectionInstance);
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1);
  }
};
export default connectDB;

// Homework assignments / Tasks :
// --Get to know about process in nodejs
// -- Get to know about connectionInstance(variable ) actually console.log the variable which stores the return obeject from the mongoose.connect() function.
