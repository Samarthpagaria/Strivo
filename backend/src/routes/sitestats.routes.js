import { Router } from "express";
import { getUpvotes, incrementUpvotes } from "../controllers/sitestat.controller.js";

const router = Router();

router.route("/").get(getUpvotes);
router.route("/increment").post(incrementUpvotes);

export default router;
