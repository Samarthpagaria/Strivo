import React from "react";
import { MoreVertical, CheckCircle2 } from "lucide-react";

// Helper function to format relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31556952)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31556952)} years ago`;
};

// Helper function to format duration
const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoListCard = ({
  thumbnail,
  title,
  channel,
  owner, // Backend might send owner
  views,
  uploaded,
  createdAt, // Backend sends createdAt
  description,
  duration,
  avatar,
  isVerified,
  onClick,
}) => {
  // Normalize data
  const ownerData = Array.isArray(owner) ? owner[0] : owner;
  const channelName =
    channel || ownerData?.fullName || ownerData?.username || "Unknown Channel";
  const channelAvatar =
    avatar ||
    ownerData?.avatar ||
    "https://picsum.photos/id/10/10/300?grayscale&blur=2";

  // Decide which time to show: if 'uploaded' is a human string (like mock) use it,
  // otherwise format the date if available
  const uploadedTime =
    uploaded && isNaN(Date.parse(uploaded))
      ? uploaded
      : getRelativeTime(uploaded || createdAt);

  const viewCount = views || 0;
  const formattedDuration = formatDuration(duration);

  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row gap-4 p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors w-full group"
    >
      {/* Thumbnail Section */}
      <div className="relative shrink-0 w-full sm:w-[360px] aspect-video rounded-xl overflow-hidden bg-gray-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          {formattedDuration}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-medium leading-snug text-gray-900 line-clamp-2 mb-1">
            {title}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all">
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center text-xs text-gray-600 mb-3">
          <span>{viewCount} views</span>
          <span className="mx-1">•</span>
          <span>{uploadedTime}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={channelAvatar}
            alt={channelName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
            {channelName}
            {isVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 fill-current" />
            )}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VideoListCard;
