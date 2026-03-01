import mongoose, { isValidObjectId, setDriver } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;
  if (!name || name.trim().length === 0) {
    throw new ApiError(400, "Playlist name is required");
  }
  // 2. Validate user
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  const createdPlaylist = await Playlist.create({
    name,
    description,
    owner: userId,
  });
  if (!createdPlaylist) {
    return res.status(200).json(new ApiResponse(200, [], "No playlistFound"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdPlaylist, "Playlist created."));
});
const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "User unauthorized");
  }
  if (userId !== req.user?._id.toString()) {
    throw new ApiError(400, "Unauthorized access");
  }
  const fetchPlaylists = await Playlist.find({ owner: userId }).populate(
    "videos"
  );
  if (fetchPlaylists.length == 0) {
    return res.status(200).json(new ApiResponse(200, [], "No playlist found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, fetchPlaylists, "Playlist fetched"));
});
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist id is invalid");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User unauthorized");
  }

  const playlist = await Playlist.aggregate([
    // 1️⃣ Only this user's playlist with this id
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
        owner: new mongoose.Types.ObjectId(userId),
      },
    },

    // 2️⃣ Lookup full video documents for the ids in playlist.videos
    {
      $lookup: {
        from: "videos",
        let: { videoIds: "$videos" }, // playlist.videos (array of ObjectIds)
        pipeline: [
          {
            // keep only videos whose _id is in playlist.videos
            $match: {
              $expr: { $in: ["$_id", "$$videoIds"] },
            },
          },

          // 3️⃣ For each video, fetch its owner (user)
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },

          // 4️⃣ Shape video fields + flatten owner array → single object
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              isPublished: 1,
              createdAt: 1,
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },

          // 5️⃣ Sort videos by newest first (optional, but nice)
          {
            $sort: { createdAt: -1 },
          },
        ],
        as: "videos", // this overwrites the original videos field with full docs
      },
    },

    // 6️⃣ (Optional but useful) populate playlist owner details too
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    },
  ]);

  if (!playlist.length) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"));
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid request");
  }
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(403, "Unauthorized access");
  }
  const addedVideoToPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: userId },
    { $addToSet: { videos: videoId } },
    { new: true }
  );
  if (!addedVideoToPlaylist) {
    throw new ApiError(404, "Unable to add video to playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, addedVideoToPlaylist, "Video added to playlist")
    );
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid request");
  }
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(403, "Unable to access");
  }
  const removedVideoFromPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: userId },
    { $pull: { videos: videoId } },
    { new: true }
  );
  if (!removedVideoFromPlaylist) {
    throw new ApiError(404, "Unable to remove video from playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        removedVideoFromPlaylist,
        "Video removed from playlist"
      )
    );
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const userId = req.user?._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  const deletedPlaylist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: userId,
  });

  if (!deletedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found or you don't have permission to delete it"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
    );
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const { _id: userId } = req.user || {};

  // Validate playlist id
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  // Validate user
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  // Prepare update payload
  const updateData = {};

  // Update name if provided
  if (name !== undefined) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new ApiError(400, "Playlist name cannot be empty");
    }
    updateData.name = trimmedName;
  }

  // Update description if provided
  if (description !== undefined) {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      throw new ApiError(400, "Playlist description cannot be empty");
    }
    updateData.description = trimmedDescription;
  }

  // If nothing is passed to update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(
      400,
      "Please provide at least one field (name or description) to update"
    );
  }

  // Update playlist
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: userId },
    { $set: updateData },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found or you don't have permission to update it"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});
export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
