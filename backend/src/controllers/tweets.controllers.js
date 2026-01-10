import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }
  const { content } = req.body;
  if (!content || content.trim().length <= 0) {
    throw new ApiError(400, "Tweet content is required");
  }
  const tweet = await Tweet.create({ owner: userId, content: content.trim() });
  if (!tweet) {
    throw new ApiError(500, "Failed to create tweet");
  }
  console.log("Tweet created:", tweet);
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet Created Successfully"));
});
const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }
  const tweets = await Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        "ownerDetails.username": 1,
        "ownerDetails.fullName": 1,
        "ownerDetails.email": 1,
        "ownerDetails.avatar": 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User Tweets fetched Successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.tweetId;
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }
  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const { content } = req.body;
  if (!content || content.trim().length <= 0) {
    throw new ApiError(400, "Tweet content is required");
  }
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: userId },
    { $set: { content: content.trim() } },
    { new: true, runValidators: true }
  );
  if (!updatedTweet) {
    throw new ApiError(500, "Failed to update tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {

  const tweetId = req.params.tweetId;
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }
  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: userId,
  });
  if (!deletedTweet) {
    throw new ApiError(
      404,
      "Tweet not found or you're not authorized to delete it"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted Successfully"));
});

const getHomeFeedTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const subscriptions = await Subscription.find({ subscriber: userId }).select(
    "channel"
  );
  const channelIds = subscriptions.map((s) => s.channel);

  const subscribedTweets = await Tweet.aggregate([
    {
      $match: {
        owner: { $in: channelIds },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    { $project: { likes: 0 } },
    { $sort: { createdAt: -1 } },
    { $limit: 20 },
  ]);

  const randomTweets = await Tweet.aggregate([
    { $sample: { size: 30 } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    { $project: { likes: 0 } },
  ]);

  const subscribedTweetIds = new Set(
    subscribedTweets.map((t) => t._id.toString())
  );
  const filteredRandomTweets = randomTweets.filter(
    (t) => !subscribedTweetIds.has(t._id.toString())
  );

  const combinedFeed = [...subscribedTweets, ...filteredRandomTweets];


  combinedFeed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        combinedFeed,
        "Home feed tweets fetched successfully"
      )
    );
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getHomeFeedTweets,
};
