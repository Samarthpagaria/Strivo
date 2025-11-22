import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
  import "dotenv/config";
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// So this connectDb is an async function which returns a promise
// So we can use .then() method to handle the promise resolution
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Errrr: " + error);
      throw error;
    });
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port : ${process.env.PORT || 8000}`);
    });
    server.on("connection", (socket) => {
      console.log("A new client has connected!");
    });

    server.on("close", () => {
      console.log("The server is shutting down.");
    });
  })
  .catch((error) => {
    console.log("Mongodb DB connection failed !! ", error);
  });

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
