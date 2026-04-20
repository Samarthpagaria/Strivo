import React from "react";
import { motion } from "framer-motion";
import { History, Play, Trash2, Clock } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { useVideo } from "../ContentApi/VideoContext";
import { useNavigate } from "react-router-dom";

const WatchHistory = () => {
  const { watchHistoryQuery, clearWatchHistoryMutation } = useVideo();
  const videos = watchHistoryQuery?.data || [];
  const navigate = useNavigate();

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your watch history? This cannot be undone.",
      )
    ) {
      clearWatchHistoryMutation.mutate();
    }
  };

  const handleResumeLast = () => {
    if (videos.length > 0) {
      navigate(`/watch/${videos[0]._id}`);
    }
  };

  if (watchHistoryQuery.isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold font-inter text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
                <History size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">Library</span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-gray-900 tracking-tight">
              Watch History
            </h1>
            <p className="text-sm font-medium font-inter text-gray-500">
              Manage your recently watched videos and activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={handleResumeLast}
                disabled={videos.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold font-inter hover:bg-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
             >
                <Play size={14} fill="currentColor" />
                Resume Last
             </button>
             <button 
                onClick={handleClearHistory}
                disabled={videos.length === 0 || clearWatchHistoryMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-900 rounded-full text-xs font-bold font-inter hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
             >
                <Trash2 size={14} />
                Clear All History
             </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-12">
          {videos.length > 0 ? (
            <div className="space-y-12">
                <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">Recent Activity</span>
                    <div className="h-[1px] flex-1 bg-gray-100 ml-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {videos.map((video, index) => (
                    <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    >
                    <VideoCard {...video} />
                    </motion.div>
                ))}
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="p-6 bg-gray-50 rounded-full mb-6">
                <History size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black font-satoshi text-gray-900 uppercase tracking-tight">Timeline Empty</h3>
              <p className="text-sm font-medium font-inter text-gray-400 mt-2 max-w-xs text-center">
                Your watch history is currently empty. Start exploring videos to build your timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchHistory;
