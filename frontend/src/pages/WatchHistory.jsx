import React from "react";
import { motion } from "framer-motion";
import { History, Play, Trash2, Clock } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { useVideo } from "../ContentApi/VideoContext";
import { useNavigate } from "react-router-dom";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
    <div className="absolute w-full h-[1px] bg-border dark:bg-white/10" />
    <div className="absolute h-full w-[1px] bg-border dark:bg-white/10" />
  </div>
);

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
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest font-satoshi text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  // Handle potential query errors
  if (watchHistoryQuery.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-background">
         <div className="p-10 border border-border dark:border-white/10 text-center relative bg-muted/10">
            <Crosshair className="-top-1.5 -left-1.5" />
            <Crosshair className="-top-1.5 -right-1.5" />
            <Crosshair className="-bottom-1.5 -left-1.5" />
            <Crosshair className="-bottom-1.5 -right-1.5" />
            <h2 className="text-xl font-black font-satoshi text-foreground tracking-tight uppercase">Sync Error</h2>
            <p className="text-muted-foreground font-inter text-sm mt-2 font-medium">Unable to fetch your watch history.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden transition-colors duration-300">
      <div className="w-full mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border dark:border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground/60">
                <History size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">Library</span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-foreground tracking-tight">
              Watch History
            </h1>
            <p className="text-sm font-medium font-inter text-muted-foreground/80">
              Manage your recently watched videos and activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={handleResumeLast}
                disabled={videos.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-xs font-bold font-inter hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
             >
                <Play size={14} fill="currentColor" />
                Resume Last
             </button>
             <button 
                onClick={handleClearHistory}
                disabled={videos.length === 0 || clearWatchHistoryMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 border border-border dark:border-white/10 text-foreground rounded-full text-xs font-bold font-inter hover:bg-muted/50 dark:hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
             >
                <Trash2 size={14} />
                Clear All History
             </button>
          </div>
        </div>

        {/* Content Section - Tabular Grid */}
        <div className="mt-12">
          {videos.length > 0 ? (
            <div className="relative border-t border-l border-border dark:border-white/10 bg-background">
               {/* Outer Crosshairs for the entire grid container */}
               <Crosshair className="-top-1.5 -left-1.5" />
               <Crosshair className="-top-1.5 -right-1.5" />
               <Crosshair className="-bottom-1.5 -left-1.5" />
               <Crosshair className="-bottom-1.5 -right-1.5" />

                <div 
                  className="grid" 
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
                >
                 {videos.map((video, index) => (
                   <motion.div
                     key={video._id}
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: index * 0.03 }}
                     className="relative border-r border-b border-border dark:border-white/10 p-4 flex flex-col hover:bg-muted/10 dark:hover:bg-white/5 transition-colors group"
                   >
                     {/* Inner Crosshair for cells */}
                     <Crosshair className="-bottom-1.5 -right-1.5 z-10 opacity-30 group-hover:opacity-100 transition-opacity" />
                     <VideoCard {...video} />
                   </motion.div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 relative border border-border dark:border-white/10 bg-muted/10 rounded-2xl overflow-hidden">
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />
              
              <div className="p-8 bg-background dark:bg-white/5 border border-border dark:border-white/10 rounded-full mb-8 shadow-sm">
                <History size={48} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black font-satoshi text-foreground uppercase tracking-tight">Timeline Empty</h3>
              <p className="text-sm font-medium font-inter text-muted-foreground/60 mt-3 max-w-sm text-center">
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
