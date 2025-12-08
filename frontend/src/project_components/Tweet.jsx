import React, { useState } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
} from "lucide-react";

const Tweet = ({
  username = "John Doe",
  handle = "@johndoe",
  timestamp = "2h",
  content = "This is a sample tweet! 🚀 #React #WebDev",
  avatar = "https://picsum.photos/id/64/48/48",
  replies = 12,
  retweets = 45,
  likes = 128,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleRetweet = () => {
    setIsRetweeted(!isRetweeted);
    setRetweetCount(isRetweeted ? retweetCount - 1 : retweetCount + 1);
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <img src={avatar} alt={username} className="w-12 h-12 rounded-full" />
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-semibold text-gray-900 hover:underline">
                {username}
              </span>
              <span className="text-gray-500 text-sm">
                {handle} · {timestamp}
              </span>
            </div>
            <button className="p-1 hover:bg-blue-50 rounded-full transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Tweet Text */}
          <div className="mt-1 text-gray-900 whitespace-pre-wrap wrap-break-word">
            {content}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            {/* Reply */}
            <button className="flex items-center gap-2 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
              </div>
              <span className="text-sm text-gray-500 group-hover:text-blue-500">
                {replies}
              </span>
            </button>

            {/* Retweet */}
            <button
              onClick={handleRetweet}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Repeat2
                  className={`w-4 h-4 ${
                    isRetweeted
                      ? "text-green-500"
                      : "text-gray-500 group-hover:text-green-500"
                  }`}
                />
              </div>
              <span
                className={`text-sm ${
                  isRetweeted
                    ? "text-green-500"
                    : "text-gray-500 group-hover:text-green-500"
                }`}
              >
                {retweetCount}
              </span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                <Heart
                  className={`w-4 h-4 ${
                    isLiked
                      ? "text-pink-500 fill-pink-500"
                      : "text-gray-500 group-hover:text-pink-500"
                  }`}
                />
              </div>
              <span
                className={`text-sm ${
                  isLiked
                    ? "text-pink-500"
                    : "text-gray-500 group-hover:text-pink-500"
                }`}
              >
                {likeCount}
              </span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
