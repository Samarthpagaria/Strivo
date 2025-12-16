import React from "react";
import { ListVideo } from "lucide-react";

const PlaylistCard = ({
  title = "My Awesome Playlist",
  videoCount = 12,
  thumbnail = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
  duration = "2:45:30",
}) => {
  return (
    <div className="group cursor-pointer">
      {/* Thumbnail Container with Stacked Effect */}
      <div className="relative mb-3 pb-1 pr-1">
        {/* Stacked cards effect - background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-gray-400 translate-x-3 translate-y-3 rounded-xl opacity-50 shadow-md"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-slate-400 translate-x-2 translate-y-2 rounded-xl opacity-65 shadow-md"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-gray-500 translate-x-1 translate-y-1 rounded-xl opacity-75 shadow-md"></div>
        {/* Main thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] z-10 bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Playlist icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
              <ListVideo className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Video count badge */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
            <ListVideo className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">
              {videoCount} videos
            </span>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
            {duration}
          </div>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="px-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View full playlist
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
