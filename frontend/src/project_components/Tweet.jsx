import React, { useState } from "react";
import { Heart } from "lucide-react";

const Tweet = ({
  username = "John Doe",
  handle = "@johndoe",
  timestamp = "2h",
  content = "This is a sample tweet! 🚀 #React #WebDev",
  avatar = "https://picsum.photos/id/64/48/48",
  likes = 128,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-semibold text-gray-900 hover:underline">
                {username}
              </span>
              <span className="text-gray-500 text-sm">
                {handle} · {timestamp}
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
  