import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  togglePublishStatus,
  updateVideo,
  deleteVideo,
  getHomeFeedVideos,
  getAllVideos,
  getVideo,
  publishAVideo,
  getRelatedVideos,
} from "../controllers/videos.controllers.js";
const router = Router();

// Public routes
router.route("/related/:videoId").get(getRelatedVideos);
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideo);

router.use(verifyJWT);
import { upload } from "../middlewares/multer.middleware.js";

router
  .route("/")
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo // Done
  );

router.route("/home-feed").get(getHomeFeedVideos);


router
  .route("/:videoId")
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
