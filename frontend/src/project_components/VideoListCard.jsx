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
      className="flex flex-col sm:flex-row gap-5 p-3 rounded-2xl cursor-pointer hover:bg-muted/50 dark:hover:bg-white/5 transition-all duration-300 w-full group border border-transparent hover:border-border dark:hover:border-white/5"
    >
      {/* Thumbnail Section */}
      <div className="relative shrink-0 w-full sm:w-[320px] aspect-video rounded-xl overflow-hidden bg-muted/50 dark:bg-black/40 border border-border dark:border-white/5 shadow-sm">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-black font-satoshi px-1.5 py-0.5 rounded-md shadow-lg border border-white/10 uppercase tracking-tight">
          {formattedDuration}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 py-1 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-black font-satoshi leading-tight text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted dark:hover:bg-white/10 rounded-full transition-all shrink-0">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center text-[11px] font-black uppercase tracking-widest font-satoshi text-muted-foreground/60 mb-4">
          <span>{viewCount.toLocaleString()} Views</span>
          <span className="mx-2 opacity-30">|</span>
          <span>{uploadedTime}</span>
        </div>

        <div className="flex items-center gap-3 mb-4 group/channel w-fit">
          <div className="relative">
            <img
              src={channelAvatar}
              alt={channelName}
              className="w-8 h-8 rounded-full object-cover border border-border dark:border-white/10"
            />
            {isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-background dark:bg-black rounded-full p-0.5">
                <CheckCircle2 className="w-3 h-3 text-primary fill-primary/10" />
              </div>
            )}
          </div>
          <span className="text-sm font-black font-satoshi text-muted-foreground group-hover/channel:text-foreground transition-colors uppercase tracking-tight">
            {channelName}
          </span>
        </div>

        <p className="text-sm font-medium font-inter text-muted-foreground/70 line-clamp-2 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VideoListCard;
