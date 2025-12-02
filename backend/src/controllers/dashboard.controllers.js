import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models";
import { Subscription } from "../models/subscription.models";
import { Like } from "../models/like.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.models";

/**
 * GET /dashboard/stats
 * Returns: { total_videos, total_subscribers, total_views, total_likes }
 *
 * Simple approach:
 *  - Match the channel user by req.user._id
 *  - Lookup videos owned by this user
 *  - Lookup subscriptions (subscribers)
 *  - Lookup all users and sum occurrences of channel video IDs in their watchHistory => total_views
 *  - Lookup likes where like.video ∈ channel videoIds => total_likes
 */
export const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid or missing user id");
  }

  const agg = [
    { $match: { _id: mongoose.Types.ObjectId(userId) } },

    // videos owned by this user
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },

    // subscribers of this channel
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    // compute total views by scanning users' watchHistory arrays
    {
      $lookup: {
        from: "users",
        let: { videoIds: "$videos._id" },
        pipeline: [
          {
            $project: {
              matches: {
                $size: {
                  $filter: {
                    input: "$watchHistory",
                    as: "wh",
                    cond: { $in: ["$$wh", "$$videoIds"] },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              totalViews: { $sum: "$matches" },
            },
          },
        ],
        as: "viewsAgg",
      },
    },

    // compute total likes on the channel's videos
    {
      $lookup: {
        from: "likes",
        let: { videoIds: "$videos._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$video", "$$videoIds"] },
            },
          },
          { $count: "totalLikes" },
        ],
        as: "likesAgg",
      },
    },

    // convert arrays into numeric totals (safe defaults)
    {
      $addFields: {
        total_videos: { $size: "$videos" },
        total_subscribers: { $size: "$subscribers" },
        total_views: {
          $ifNull: [{ $arrayElemAt: ["$viewsAgg.totalViews", 0] }, 0],
        },
        total_likes: {
          $ifNull: [{ $arrayElemAt: ["$likesAgg.totalLikes", 0] }, 0],
        },
      },
    },

    // remove intermediate arrays
    {
      $project: {
        videos: 0,
        subscribers: 0,
        viewsAgg: 0,
        likesAgg: 0,
      },
    },
  ];

  const result = await User.aggregate(agg);
  const statsDoc = result[0] || {
    total_videos: 0,
    total_subscribers: 0,
    total_views: 0,
    total_likes: 0,
  };

  const data = {
    total_videos: statsDoc.total_videos,
    total_subscribers: statsDoc.total_subscribers,
    total_views: statsDoc.total_views,
    total_likes: statsDoc.total_likes,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Stats fetched successfully"));
});
export const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid or missing user id");
  }

  // Fetch ALL videos created by this channel/user
  const videos = await Video.find({
    owner: mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 }) // newest first (optional)
    .select("-__v") // clean response (optional)
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { total_videos: videos.length, videos },
        "Channel videos fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
