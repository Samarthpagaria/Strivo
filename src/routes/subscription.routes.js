import { Router } from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getUserSubscribedChannels,
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/c/:channelId")
  .get(getUserSubscribedChannels)
  .post(toggleSubscription);
router.route("/u/:subscriberId").get(getUserChannelSubscribers);
export default router;
