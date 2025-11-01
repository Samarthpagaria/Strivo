import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    orgin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(urlencoded({ extended: true })); // Correct. It takes the encoded string from the request body (e.g., user%5Bname%5D=sam) and decodes it into a clean JavaScript object, which it then attaches to req.body. (htiesh sir took example of the url) and extended is used to parse nested objects
//explore cors

app.use(express.static("public"));
app.use(cookieParser());

//routes will be here and also imported
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
export { app };
