import { SiteStat } from "../models/sitestat.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUpvotes = asyncHandler(async (req, res) => {
    let stat = await SiteStat.findOne();
    if (!stat) {
        stat = await SiteStat.create({ upvotes: 0 });
    }
    return res.status(200).json(new ApiResponse(200, stat, "Upvotes retrieved successfully"));
});

const incrementUpvotes = asyncHandler(async (req, res) => {
    let stat = await SiteStat.findOne();
    if (!stat) {
        stat = await SiteStat.create({ upvotes: 1 });
    } else {
        stat.upvotes += 1;
        await stat.save();
    }
    return res.status(200).json(new ApiResponse(200, stat, "Upvoted successfully"));
});

export { getUpvotes, incrementUpvotes };
