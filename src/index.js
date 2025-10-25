import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import "dotenv/config";
import express from "express";
import connectDB from "./db/index.js";
connectDB();

const app = express();

/*
--- this is the syntax if want to write database connection in the main index.js file -----
import express from "express";
const app = express();
(async () => {
  try {
      mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      app.on("error", (error) => {
          console.log("Errrr: " + error);
          throw error;
      })
      app.listen(process.env.PORT, () => {
          console.log(`Server started at http://localhost:${process.env.PORT}`);
      });
  } catch (error) {
    console.log("Error connecting to the database:", error);
    throw error;
  }
})();
*/
