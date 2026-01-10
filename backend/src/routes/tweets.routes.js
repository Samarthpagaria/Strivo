import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  updateTweet,
  deleteTweet,
  getUserTweets,
  getHomeFeedTweets,
} from "../controllers/tweets.controllers.js";
const router = Router();

router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/feed").get(getHomeFeedTweets);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
export default router;
