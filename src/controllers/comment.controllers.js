import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";

const getvideoComments = asyncHandler(async (req, res) => {
  //TODO:Get list of comments of video
  const videoId = req.params.videoId;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const comments = await Comment.find({ video: videoId })
    .populate("owner", "username avatar email fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addCommentToVideo = asyncHandler(async (req, res) => {
  // TODO:Add comment to video
  const videoId = req.params.videoId;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 2. Check if video exists
  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }
  const { content } = req.body;
  const owner = req.user?._id;
  if (!content || content.trim().length <= 0) {
    throw new ApiError(400, "Comment content is required");
  }
  if (!owner || !isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid owner ID");
  }
  const newComment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: owner,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // 1. Validate commentId
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // 2. Get user from JWT
  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(401, "Unauthorized");
  }

  // 3. Delete only if this comment belongs to the logged-in user
  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: userId,
  });

  if (!deletedComment) {
    // Could be: comment doesn't exist OR not owned by this user
    throw new ApiError(404, "Comment not found");
    // or: throw new ApiError(403, "You are not allowed to delete this comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});
const updateComment = asyncHandler(async (req, res) => {
  // TODO:Update comment
  const commentId = req.params.commentId;
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }
  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const { content } = req.body;
  if (!content || content.trim().length <= 0) {
    throw new ApiError(400, "Comment content is required");
  }
  const updateComment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: userId },
    { $set: { content: content.trim() } },
    { new: true, runValidators: true }
    );
    if(!updateComment){
      throw new ApiError(500,"Failed to update comment");
    }
  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "Comment updated successfully"));
});

export { getvideoComments, addCommentToVideo, deleteComment, updateComment };
