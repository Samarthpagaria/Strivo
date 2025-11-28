import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getvideoComments,
  addCommentToVideo,
  deleteComment,
  updateComment,
} from "../controllers/comment.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/:videoId").get(getvideoComments).post(addCommentToVideo);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
