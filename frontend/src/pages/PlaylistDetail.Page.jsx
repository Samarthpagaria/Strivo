import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Shuffle, ListVideo, Share2 } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { usePlaylist } from "../ContentApi/PlaylistContext";
import { useToast } from "../ContentApi/ToastContext";

const Crosshair = ({ className }) => (
  <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
    <div className="absolute w-full h-[1px] bg-border dark:bg-white/10" />
    <div className="absolute h-full w-[1px] bg-border dark:bg-white/10" />
  </div>
);

function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    fetchPlayListById: data,
    isFetchingPlayListById: isLoading,
    setPlaylistId,
  } = usePlaylist();

  useEffect(() => {
    if (playlistId) setPlaylistId(playlistId);
  }, [playlistId, setPlaylistId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const playlist = data?.data;
  const videos = playlist?.videos || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-(--breakpoint-2xl) mx-auto px-4 md:px-8 pt-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-muted/30 border border-border rounded-full hover:bg-muted transition-all duration-300"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Back</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-10 md:mb-14 items-start lg:items-end">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2.5 text-primary/80">
              <ListVideo size={14} />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] font-satoshi">
                Playlist
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold font-satoshi tracking-tight leading-none text-foreground">
              {playlist?.name}
            </h1>
            
            <p className="text-sm md:text-[15px] font-normal font-inter text-muted-foreground max-w-2xl leading-relaxed">
              {playlist?.description || "Curated content collection."}
            </p>

            <div className="flex items-center gap-6 pt-2">
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-0.5">Videos</span>
                  <span className="text-lg md:text-xl font-bold font-satoshi">{videos.length}</span>
               </div>
               <div className="w-[1px] h-8 bg-border/50" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-0.5">Last Sync</span>
                  <span className="text-xl font-bold font-satoshi">
                    {playlist?.updatedAt ? new Date(playlist.updatedAt).toLocaleDateString() : "Live"}
                  </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-8 py-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">
                <Play fill="currentColor" className="w-3.5 h-3.5" />
                <span className="font-bold uppercase text-[10px] tracking-widest">Play All</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-3 border border-border rounded-full hover:bg-muted transition-colors"
              title="Copy Playlist Link"
            >
                <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Grid Content */}
        <div className="relative border-t border-l border-border bg-background mb-20">
          <Crosshair className="-top-1.5 -left-1.5 z-20" />
          <Crosshair className="-top-1.5 -right-1.5 z-20" />
          <Crosshair className="-bottom-1.5 -left-1.5 z-20" />
          <Crosshair className="-bottom-1.5 -right-1.5 z-20" />

          <div 
            className="grid" 
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  className="relative border-r border-b border-border p-4 hover:bg-muted/20 transition-all duration-300 group"
                >
                  <Crosshair className="-bottom-1.5 -right-1.5 z-10" />
                  
                  <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-4xl font-bold font-satoshi text-foreground/[0.03]">
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <VideoCard {...video} />
                </motion.div>
              ))
            ) : (
                <div className="col-span-full py-40 border-r border-b border-border flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 border border-dashed border-border rounded-full flex items-center justify-center mb-4">
                    <ListVideo className="text-muted-foreground/20 w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">Empty Collection</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">No assets found in this playlist.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetail;
