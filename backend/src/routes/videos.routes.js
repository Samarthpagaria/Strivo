import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

import {
  togglePublishStatus,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getVideo,
  publishAVideo,
} from "../controllers/videos.controllers";
const router = Router();

router.use(verifyJWT);
import { upload } from "../middlewares/multer.middleware";

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideo)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
