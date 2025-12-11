import React from "react";
import { MoreVertical, CheckCircle2 } from "lucide-react";

const VideoListCard = ({
  thumbnail,
  title,
  channel,
  views,
  uploaded,
  description,
  duration,
  avatar,
  isVerified,
  onClick,
}) => {
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
          {duration}
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
          <span>{views} views</span>
          <span className="mx-1">•</span>
          <span>{uploaded}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={avatar}
            alt={channel}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
            {channel}
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
