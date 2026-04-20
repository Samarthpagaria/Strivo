import React from "react";
import { motion } from "framer-motion";
import { Heart, Play, Shuffle } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { useVideo } from "../ContentApi/VideoContext";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div
    className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}
  >
    <div className="absolute w-full h-[1px] bg-gray-300" />
    <div className="absolute h-full w-[1px] bg-gray-300" />
  </div>
);

const LikedVideos = () => {
  const { likedVideosQuery } = useVideo();
  const likedVideosData = likedVideosQuery?.data?.data || {
    total: 0,
    videos: [],
  };
  const videos = likedVideosData.videos || [];
  const total = likedVideosData.total || 0;

  if (likedVideosQuery.isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold font-inter text-gray-400">
            Loading favorites...
          </p>
        </div>
      </div>
    );
  }

  if (likedVideosQuery.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="p-6 border border-gray-200 text-center relative">
          <Crosshair className="-top-1.5 -left-1.5" />
          <Crosshair className="-top-1.5 -right-1.5" />
          <Crosshair className="-bottom-1.5 -left-1.5" />
          <Crosshair className="-bottom-1.5 -right-1.5" />
          <h2 className="text-xl font-black font-satoshi text-gray-900 tracking-tight">
            Sync Error
          </h2>
          <p className="text-gray-500 font-inter text-sm mt-2 font-medium">
            Unable to fetch your liked videos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      <div className="w-full mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">
                Collection
              </span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-gray-900 tracking-tight">
              Liked Videos
            </h1>
            <p className="text-sm font-medium font-inter text-gray-500">
              Your curated collection of favorite videos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
              <span className="text-xl font-black font-satoshi text-gray-900">
                {total}
              </span>
              <span className="text-[10px] font-bold font-inter text-gray-400 uppercase tracking-widest">
                Saved
              </span>
            </div>
          </div>
        </div>

        {/* Content Section - Tabular Grid */}
        <div className="mt-12">
          {videos.length > 0 ? (
            <div className="relative border-t border-l border-gray-200 bg-white">
              {/* Outer Crosshairs for the entire grid container */}
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative border-r border-b border-gray-200 p-4 flex flex-col hover:bg-gray-50 transition-colors"
                  >
                    {/* Inner Crosshair for cells */}
                    <Crosshair className="-bottom-1.5 -right-1.5 z-10" />

                    <VideoCard {...video} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 relative border border-gray-200 bg-gray-50/30">
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />

              <div className="p-6 bg-white border border-gray-100 rounded-full mb-6">
                <Heart size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black font-satoshi text-gray-900 uppercase tracking-tight">
                Timeline Empty
              </h3>
              <p className="text-sm font-medium font-inter text-gray-400 mt-2 max-w-xs text-center">
                Your liked videos collection is currently empty. Start exploring
                videos to build your timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedVideos;
