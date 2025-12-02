import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  //only show published vodes
  matchStage.isPublished = true;

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
    return (
      res.status(200),
      json(
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
      )
    );
  } catch (error) {
    throw new ApiResponse(500, "Error while fetching videos" + error.message);
  }
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
    owner: req.user._id,
    title: req.body.title,
    description: req.body.description,
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

import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.model.js"; // optional cleanup
import { Comment } from "../models/comment.model.js"; // optional cleanup (if you have it)
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { deleteFromCloudinary } from "../utils/cloudinary.js"; // optional if you implement delete

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

  // 4. Delete the video file from Cloudinary
  if (video.videoFile) {
    try {
      // Extract public ID from Cloudinary URL
      const publicId = video.videoFile.split("/").pop().split(".")[0];
      await uploadOnCloudinary.destroy(publicId, { resource_type: "video" });
    } catch (error) {
      console.error("Error deleting video from Cloudinary:", error);
      // Continue with deletion even if Cloudinary deletion fails
    }
  }

  // 5. Delete the thumbnail from Cloudinary
  if (video.thumbnail) {
    try {
      // Extract public ID from Cloudinary URL
      const publicId = video.thumbnail.split("/").pop().split(".")[0];
      await uploadOnCloudinary.destroy(publicId, { resource_type: "image" });
    } catch (error) {
      console.error("Error deleting thumbnail from Cloudinary:", error);
      // Continue with deletion even if Cloudinary deletion fails
    }
  }

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
      // Delete old thumbnail from Cloudinary if it exists
      if (video.thumbnail) {
        const oldThumbnailId = video.thumbnail.split("/").pop().split(".")[0];
        await uploadOnCloudinary.destroy(oldThumbnailId, {
          resource_type: "image",
        });
      }

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
};
