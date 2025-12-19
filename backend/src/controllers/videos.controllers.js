import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscription } from "../models/subscription.models.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  //TODO:get all videos based on query , sort ,pagination

  // parsing page and limit to num and initlize skip
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const matchStage = {};
  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  // Filter by user if userId is provided
  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  // Only show published videos UNLESS the user is viewing their own videos
  // If userId matches the authenticated user, show all videos (published and unpublished)
  const isViewingOwnVideos = userId && userId === req.user?._id.toString();
  if (!isViewingOwnVideos) {
    matchStage.isPublished = true;
  }

  //Build sortStage
  const sortStage = {};

  const sortOrder = sortType === "asc" ? 1 : -1;
  sortStage[sortBy] = sortOrder;

  try {
    //get total count for pagination
    const totalVideos = await Video.countDocuments(matchStage);

    //getpaginated videos
    const videos = await Video.aggregatePaginate(
      Video.aggregate([
        { $match: matchStage },
        { $sort: sortStage },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
          },
        },
        { $skip: skip },
        { $limit: limitNum },
      ]),
      { page: pageNum, limit: limitNum }
    );
    if (!videos || videos.docs.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { videos: [], total: 0 },
            "Videos fetched successfully"
          )
        );
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos: videos.docs,
          pagination: {
            totalVideos: videos.totalDocs,
            totalPages: videos.totalPages,
            currentPage: videos.page,
            hasNextPage: videos.hasNextPage,
            hasPrevPage: videos.hasPrevPage,
          },
        },
        "Videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error while fetching videos: " + error.message);
  }
});

const getHomeFeedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }
  const subscriptions = await Subscription.find({ subscriber: userId }).select(
    "channel"
  );
  const channelIds = subscriptions.map((s) => s.channel);
  const subscribedVideos = await Video.aggregate([
    { $match: { owner: { $in: channelIds }, isPublished: true } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: { username: 1, fullName: 1, avatar: 1 },
          },
        ],
      },
    },
    { $unwind: "$owner" },
    { $limit: 20 },
  ]);
  const randomVideos = await Video.aggregate([
    { $match: { isPublished: true } },
    { $sample: { size: 30 } }, // random 30 videos
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" },
  ]);
  const combinedFeed = [...subscribedVideos, ...randomVideos];
  combinedFeed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { feed: combinedFeed },
        "Home feed videos fetched successfully"
      )
    );
});
const publishAVideo = asyncHandler(async (req, res) => {
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;

  let thumbnailLocalPath;
  if (req.files?.thumbnail?.length > 0) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required.");
  }

  const video = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video || !thumbnail) {
    throw new ApiError(
      500,
      "Internal error while uploading video or thumbnail"
    );
  }

  const publishedVideo = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title: req.body.title,
    description: req.body.description,
    duration: video.duration,
    owner: req.user._id,
    isPublished: true,
  });

  if (!publishedVideo) {
    throw new ApiError(500, "Internal error while publishing video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, publishedVideo, "Video published successfully"));
});

const getVideo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Imports removed as they are duplicates of top-level imports

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  // 1. Validate video ID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 2. Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 3. Check if the user is the owner of the video
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // 4. Delete the video file from Cloudinary (Skipped as per user request)

  // 5. Delete the thumbnail from Cloudinary (Skipped as per user request)

  // 6. Delete the video document from database
  await Video.findByIdAndDelete(videoId);

  // 7. Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const userId = req.user?._id;

  // 1. Validate video ID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 2. Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 3. Check if the user is the owner of the video
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  // 4. Prepare update object
  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;

  // 5. Handle thumbnail update if provided
  if (req.file) {
    try {
      // Upload new thumbnail
      const thumbnailLocalPath = req.file.path;
      const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      if (thumbnail && thumbnail.url) {
        updateFields.thumbnail = thumbnail.url;
      } else {
        throw new ApiError(500, "Error uploading thumbnail");
      }
    } catch (error) {
      console.error("Error updating thumbnail:", error);
      throw new ApiError(500, "Error updating thumbnail");
    }
  }

  // 6. Update the video
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateFields },
    { new: true }
  ).select("-__v");

  if (!updatedVideo) {
    throw new ApiError(500, "Failed to update video");
  }

  // 7. Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  // 1. Validate video ID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 2. Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 3. Check if the user is the owner of the video
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  // 4. Toggle the isPublished status
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  // 5. Return success response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: video.isPublished },
        `Video ${video.isPublished ? "published" : "unpublished"} successfully`
      )
    );
});

export {
  togglePublishStatus,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getVideo,
  publishAVideo,
  getHomeFeedVideos,
};
