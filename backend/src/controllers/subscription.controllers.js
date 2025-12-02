import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;
  const subscriberId = req.user?._id;
  if (
    !channelId ||
    !mongoose.Types.ObjectId.isValid(channelId) ||
    !subscriberId ||
    !mongoose.Types.ObjectId.isValid(subscriberId)
  ) {
    throw new ApiError(400, "Invalid channelId or subscriberId");
  }
  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });
  if (isSubscribed) {
    //unscubscribe
    const unsubscribe = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: subscriberId,
    });
    if (!unsubscribe) {
      throw new ApiError(500, "Failed to unsubscribe");
    }
    console.log("Unsubscribed successfully:", unsubscribe);
    return res
      .status(200)
      .json(new ApiResponse(200, unsubscribe, "Channel unsubscribed."));
  } else {
    //subscriber
    const subscribe = await Subscription.create({
      channel: channelId,
      subscriber: subscriberId,
    });
    if (!subscribe) {
      throw new ApiError(500, "Failed to subscribe");
    }
    console.log("Subscribed successfully:", subscribe);
    return res
      .status(201)
      .json(new ApiResponse(true, subscribe, "Channel subscribed."));
  }
});

//controller to return subscribers list of a user channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel");
  }
  const channelObjectId = new mongoose.Types.ObjectId(channelId);

  //Ensuring that channel user exists.
  const channel = await User.findById(channelObjectId).select(
    "_id username fullName avatar"
  );
  if (!channel) {
    throw new ApiError(404, "Channel user not found");
  }
  //Fetching subscribers of the channel with user details.
  const aggResult = await Subscription.aggregate([
    {
      $match: { channel: channelObjectId },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $group: {
        _id: "$channel",
        subscriberCount: { $sum: 1 },
        subscribers: {
          $push: {
            _id: "$subscriberDetails._id",
            username: "$subscriberDetails.username",
            fullName: "$subscriberDetails.fullName",
            avatar: "$subscriberDetails.avatar",
            email: "$subscriberDetails.email",
            subscribedAt: "$createdAt",
          },
        },
      },
    },
  ]);
  const data = aggResult[0] || {
    _id: channelObjectId,
    subscriberCount: 0,
    subscribers: [],
  };

  const responsePayload = {
    channelId: channel._id,
    channelName: channel.username,
    fullName: channel.fullName,
    avatar: channel.avatar,
    subscriberCount: data.subscriberCount,
    subscribers: data.subscribers,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responsePayload,
        "Channel Subscribers fetched successfully"
      )
    );
});

//controller to return subscribed channels list  to which user has subscribed
const getUserSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid Subscriber");
  }
  const subscriberObjectId = new mongoose.Types.ObjectId(subscriberId);
  //Ensuring that subscriber user exists.
  const subscriber = await User.findById(subscriberId).select(
    "-password -refreshToken -watchHistory"
  );
  if (!subscriber) {
    throw new ApiError(404, "Subscriber user not found");
  }
  //Fetching subscribed channels of the subscriber with user details.
  const aggResult = await Subscription.aggregate([
    { $match: { subscriber: subscriberObjectId } },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    { $unwind: "$channelDetails" },
    {
      $group: {
        _id: "$subscriber",
        subscribedChannelCount: { $sum: 1 },
        subscribedChannel: {
          $push: {
            _id: "$channelDetails._id",
            username: "$channelDetails.username",
            fullName: "$channelDetails.fullName",
            avatar: "$channelDetails.avatar",
            email: "$channelDetails.email",
            subscribedAt: "$createdAt",
          },
        },
      },
    },
  ]);
  const data = aggResult[0] || {
    _id: subscriberObjectId,
    subscribedChannelCount: 0,
    subscribedChannel: [],
  };
  const responsePayload = {
    subscriberId: subscriber._id,
    subscriberName: subscriber.username,
    fullName: subscriber.fullName,
    avatar: subscriber.avatar,
    email: subscriber.email,

    subscribedChannelCount: data.subscribedChannelCount,
    subscribedChannel: data.subscribedChannel,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responsePayload,
        "Subscribed Channels fetched successfully"
      )
    );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getUserSubscribedChannels,
};
