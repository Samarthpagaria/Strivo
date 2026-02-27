import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweets.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import likesRouter from "./routes/likes.routes.js";
import videoRouter from "./routes/videos.routes.js";
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("api/v1/dashboard", dashboardRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/videos", videoRouter);
export { app };
