import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleCommenLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/likes.controllrs.js";
const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommenLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
