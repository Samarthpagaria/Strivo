import React from "react";
import { motion } from "framer-motion";
import { Heart, Play, Shuffle, Search, MoreVertical } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { useVideo } from "../ContentApi/VideoContext";

const LikedVideos = () => {
  const { likedVideosQuery } = useVideo();
  const likedVideosData = likedVideosQuery?.data?.data || {
    total: 0,
    videos: [],
  };
  const videos = likedVideosData.videos || [];
  const total = likedVideosData.total || 0;
  const updatedAt = likedVideosQuery?.dataUpdatedAt
    ? new Date(likedVideosQuery.dataUpdatedAt).toLocaleDateString()
    : "Recently";

  if (likedVideosQuery.isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (likedVideosQuery.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          Error loading liked videos
        </h2>
        <p className="text-gray-600">
          {likedVideosQuery.error?.response?.data?.message ||
            likedVideosQuery.error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fafafa]">
      <div className="w-full lg:w-[380px] lg:fixed lg:h-[calc(100vh-64px)] overflow-hidden lg:overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer bg-gray-200">
            {videos.length > 0 ? (
              <img
                src={videos[0]?.thumbnail}
                alt="Playlist Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Heart size={48} className="text-gray-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/50">
                <Play className="text-white fill-white ml-1" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Liked Videos
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span>{total} videos</span>
              <span>•</span>
              <span>Updated {updatedAt}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-lg overflow-hidden">
                {videos[0]?.owner?.avatar ? (
                  <img
                    src={videos[0].owner.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "S"
                )}
              </div>
              <span className="text-sm font-bold text-gray-800">
                Your Library
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-gray-200 disabled:opacity-50"
              disabled={videos.length === 0}
            >
              <Play size={18} fill="currentColor" />
              Play all
            </button>
            <button
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-full font-bold transition-all disabled:opacity-50"
              disabled={videos.length === 0}
            >
              <Shuffle size={18} />
            </button>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Videos you have liked across the platform will be collected here for
            easy access. Only you can view this page.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 lg:ml-[380px] p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex gap-4">
              <button className="text-sm font-bold text-gray-900 pb-4 border-b-2 border-gray-900">
                Newly added
              </button>
              <button className="text-sm font-bold text-gray-400 hover:text-gray-600 pb-4">
                Oldest
              </button>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search liked videos"
                className="bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-gray-400 w-48"
              />
            </div>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VideoCard {...video} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center ring-8 ring-gray-100/50">
                <Heart size={40} className="text-gray-300 fill-gray-100/50" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  No liked videos yet
                </h3>
                <p className="text-sm text-gray-500 max-w-[320px] mx-auto font-medium">
                  Tap the heart on any video to save it here. Your favorite
                  content will be waiting for you.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedVideos;
