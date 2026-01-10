import React, { useState } from "react";
import { Heart } from "lucide-react";

// Helper function to format relative time
const getRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31556952)
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31556952)}y ago`;
};

const Tweet = ({
  content,
  ownerDetails,
  createdAt,
  likesCount = 0,
  isLiked: initialIsLiked = false,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likesCount);

  const timestamp = createdAt ? getRelativeTime(createdAt) : "just now";

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent navigating if the whole tweet is a link
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={ownerDetails?.avatar || "https://via.placeholder.com/150"}
            alt={ownerDetails?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-semibold text-gray-900 hover:underline">
                {ownerDetails?.username}
              </span>
              <span className="text-gray-500 text-sm">
                {ownerDetails?.fullName} · {timestamp}
              </span>
            </div>

            {/* Like Button (Right side) */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 group shrink-0"
            >
              <div className="p-1.5 rounded-full transition-colors group-hover:bg-pink-100">
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isLiked
                      ? "text-pink-500 fill-pink-500"
                      : "text-gray-400 group-hover:text-pink-500"
                  }`}
                />
              </div>

              <span
                className={`text-xs transition-colors ${
                  isLiked
                    ? "text-pink-500"
                    : "text-gray-400 group-hover:text-pink-500"
                }`}
              >
                {likeCount}
              </span>
            </button>
          </div>

          {/* Tweet Text */}
          <div className="mt-1 text-gray-900 whitespace-pre-wrap break-words leading-relaxed text-sm">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
