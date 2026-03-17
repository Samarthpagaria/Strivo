import React from "react";
import { motion } from "framer-motion";
import { History, Play, Trash2, Search, Clock, Calendar } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { useVideo } from "../ContentApi/VideoContext";
import { formatDistanceToNow } from "date-fns";

const WatchHistory = () => {
  const { watchHistoryQuery } = useVideo();
  const videos = watchHistoryQuery?.data || [];
  
  if (watchHistoryQuery.isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm font-bold text-slate-400 animate-pulse">Retrieving your history...</p>
        </div>
      </div>
    );
  }

  if (watchHistoryQuery.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
            <h2 className="text-xl font-bold text-red-800">History Sync Error</h2>
            <p className="text-red-600 text-sm mt-1">{watchHistoryQuery.error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fafafa]">
      {/* Sidebar Info Section */}
      <div className="w-full lg:w-[380px] lg:fixed lg:h-[calc(100vh-64px)] overflow-hidden lg:overflow-y-auto p-6 bg-white border-r border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* History Header Card */}
          <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl group bg-slate-900 border-4 border-white">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <History size={32} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Library Management</p>
                <h2 className="text-2xl font-black">Watch History</h2>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Timeline</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{videos.length} videos</span>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <button className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200">
                        <Play size={16} fill="white" />
                        Resume Last
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Clock size={16} className="text-orange-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Auto-Sync</p>
                        <p className="text-sm font-bold text-slate-700 leading-none">Last sync 2 min ago</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200/50">
            <p className="text-xs text-slate-400 leading-relaxed font-bold">
              Your watch history is private. Only you can see what you've watched. Clearing history will affect your recommendations.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[380px] p-6 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
             <div className="flex gap-6">
                <button className="text-sm font-black text-slate-900 relative">
                    All History
                    <span className="absolute -bottom-6 left-0 right-0 h-1 bg-slate-900 rounded-full" />
                </button>
                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Videos
                </button>
                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Posts
                </button>
             </div>
             <div className="flex items-center gap-3">
                <div className="group flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                    <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500" />
                    <input
                        type="text"
                        placeholder="Scan your history..."
                        className="bg-transparent border-none text-sm font-bold focus:ring-0 placeholder:text-slate-400 w-40 md:w-60"
                    />
                </div>
             </div>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                  className="relative group"
                >
                  <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Calendar size={12} className="text-indigo-600" />
                  </div>
                  <VideoCard {...video} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl rotate-45">
                <History size={40} className="text-slate-300 -rotate-45" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Timeline Empty</h3>
                <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">
                  Start watching some videos! Your activity will be tracked here for easier access.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchHistory;
