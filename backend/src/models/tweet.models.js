import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    videos: {
      type: [String],
    },
  },
  { timestamps: true }
);
export const Tweet = mongoose.model("Tweet", tweetSchema);
