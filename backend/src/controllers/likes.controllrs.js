import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(userId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Object Id");
  }
  const likedObject = await Like.findOne({ video: videoId, likedBy: userId });
  if (!likedObject) {
    const like = await Like.findOneAndUpdate(
      { likedBy: userId, video: videoId },
      { $setOnInsert: { likedBy: userId, video: videoId } },
      { upsert: true, new: true }
    );
    if (!like) {
      throw new ApiError(500, "Not able to like the video.");
    }
    return res
      .status(200)
      .json(new ApiResponse(201, like, "Video liked successfully"));
  } else {
    const unlike = await Like.findOneAndDelete({
      likedBy: userId,
      video: videoId,
    });
    if (!unlike) {
      throw new ApiError(500, "Not able to unlike the video.");
    } else {
      return res
        .status(201)
        .json(new ApiResponse(200, unlike, "Video unliked successfully"));
    }
  }
});

const toggleCommenLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;
  if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Id");
  }

  const likedObject = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (!likedObject) {
    const like = await Like.findOneAndUpdate(
      { likedBy: userId, comment: commentId },
      { $setOnInsert: { likedBy: userId, comment: commentId } },
      { upsert: true, new: true }
    );
    if (!like) {
      throw new ApiError(500, "Not able to like the comment.");
    }
    return res
      .status(200)
      .json(new ApiResponse(201, like, "Comment liked successfully"));
  } else {
    const unlike = await Like.findOneAndDelete({
      likedBy: userId,
      comment: commentId,
    });
    if (!unlike) {
      throw new ApiError(500, "Not able to unlike the comment.");
    } else {
      return res
        .status(201)
        .json(new ApiResponse(200, unlike, "Video unliked successfully"));
    }
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;
  if (!isValidObjectId(userId) || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Id");
  }

  const likedObject = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (!likedObject) {
    const like = await Like.findOneAndUpdate(
      { likedBy: userId, tweet: tweetId },
      { $setOnInsert: { likedBy: userId, tweet: tweetId } },
      { upsert: true, new: true }
    );
    if (!like) {
      throw new ApiError(500, "Not able to like the tweet.");
    }
    return res
      .status(200)
      .json(new ApiResponse(201, like, "Tweet liked successfully"));
  } else {
    const unlike = await Like.findOneAndDelete({
      likedBy: userId,
      tweet: tweetId,
    });
    if (!unlike) {
      throw new ApiError(500, "Not able to unlike the tweet.");
    } else {
      return res
        .status(201)
        .json(new ApiResponse(200, unlike, "Tweet unliked successfully"));
    }
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");

  const pipeline = [
    // 1. only likes by this user and that reference a video
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true, $ne: null },
      },
    },

    // 2. join video document
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    // 3. unwind video array (skip likes whose video is missing)
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: false } },

    // 4. populate video.owner with selected owner fields
    {
      $lookup: {
        from: "users",
        let: { ownerId: "$video.owner" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
          { $project: { password: 0, refreshToken: 0, __v: 0 } }, // exclude sensitive fields
        ],
        as: "video.owner",
      },
    },
    { $unwind: { path: "$video.owner", preserveNullAndEmptyArrays: true } },

    // 5. sort by like createdAt (most recent first)
    { $sort: { createdAt: -1 } },

    // 6. return only the video documents (you can include like metadata if you want)
    { $replaceRoot: { newRoot: "$video" } },

    // 7. optional: remove mongoose internal fields you don't want to return (example)
    { $project: { __v: 0 } },
  ];

  const videos = await Like.aggregate(pipeline).exec();
  if (!videos) {
    throw new ApiError(404, "No liked videos found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { total: videos.length, videos },
        "Liked videos fetched"
      )
    );
});

export { toggleCommenLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
