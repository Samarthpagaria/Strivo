import React from "react";
import { MoreVertical } from "lucide-react";
import VideoCardMenu from "./VideoCardMenu";
import { useNavigate } from "react-router-dom";

// Helper function to format relative time
const getRelativeTime = (dateString) => {
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

const VideoCard = ({ _id, title, owner, views, createdAt, thumbnail }) => {
  const navigate = useNavigate();

  // Handle both API data (owner object) and mock data (channel string)
  const channelName = owner?.username || owner?.fullName || "Unknown Channel";
  const channelAvatar =
    owner?.avatar || "https://picsum.photos/id/10/10/300?grayscale&blur=2";
  const videoThumbnail = thumbnail || "https://picsum.photos/600/400.jpg";
  const uploadedTime = createdAt ? getRelativeTime(createdAt) : "Unknown";
  const viewCount = views || 0;

  const handleCardClick = () => {
    navigate(`/watch/${_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full hover:opacity-75 hover:bg-gray-200 rounded-3xl transition-all duration-300 p-2 cursor-pointer"
    >
      <div className="bg-gray-200 w-full aspect-video rounded-xl overflow-hidden ">
        <img
          src={videoThumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-3 mt-3">
        <img
          src={channelAvatar}
          alt={channelName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
          <p className="text-xs text-gray-400">{channelName}</p>
          <p className="text-xs text-gray-500">
            {viewCount} views · {uploadedTime}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <VideoCardMenu videoId={_id} />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
