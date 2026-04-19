import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  updateTweet,
  deleteTweet,
  getUserTweets,
  getHomeFeedTweets,
  getFollowingTweets,
} from "../controllers/tweets.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);

router.route("/").post(
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "videos", maxCount: 3 },
  ]),
  createTweet
);
router.route("/feed").get(getHomeFeedTweets);
router.route("/following").get(getFollowingTweets);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
export default router;
