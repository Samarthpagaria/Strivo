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
    <div className="absolute w-full h-[1px] bg-border dark:bg-white/10" />
    <div className="absolute h-full w-[1px] bg-border dark:bg-white/10" />
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
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest font-satoshi text-muted-foreground">
            Loading favorites...
          </p>
        </div>
      </div>
    );
  }

  if (likedVideosQuery.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="p-10 border border-border dark:border-white/10 text-center relative bg-muted/10">
          <Crosshair className="-top-1.5 -left-1.5" />
          <Crosshair className="-top-1.5 -right-1.5" />
          <Crosshair className="-bottom-1.5 -left-1.5" />
          <Crosshair className="-bottom-1.5 -right-1.5" />
          <h2 className="text-xl font-black font-satoshi text-foreground tracking-tight uppercase">
            Sync Error
          </h2>
          <p className="text-muted-foreground font-inter text-sm mt-2 font-medium">
            Unable to fetch your liked videos.
          </p>
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
              <Heart size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">
                Collection
              </span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-foreground tracking-tight">
              Liked Videos
            </h1>
            <p className="text-sm font-medium font-inter text-muted-foreground/80">
              Your curated collection of favorite videos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 flex items-center gap-4">
              <span className="text-2xl font-black font-satoshi text-foreground">
                {total}
              </span>
              <span className="text-[10px] font-bold font-inter text-muted-foreground uppercase tracking-widest">
                Saved
              </span>
            </div>
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
                <Heart size={48} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black font-satoshi text-foreground uppercase tracking-tight">
                Timeline Empty
              </h3>
              <p className="text-sm font-medium font-inter text-muted-foreground/60 mt-3 max-w-sm text-center">
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
