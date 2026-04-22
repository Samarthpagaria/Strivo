import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreVertical, ListPlus, ChevronRight } from "lucide-react";
import { usePlaylist } from "../ContentApi/PlaylistContext";
import { useToast } from "../ContentApi/ToastContext";

const VideoCardMenu = ({ videoId }) => {
  const { showToast } = useToast();
  const {
    allPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    isAddingVideoToPlaylist,
    isRemovingVideoFromPlaylist,
    errorRemovingVideoFromPlaylist,
  } = usePlaylist();

  // Combined loading state for both add and remove operations
  const isLoading = isAddingVideoToPlaylist || isRemovingVideoFromPlaylist;

  const handleTogglePlaylist = (playlist) => {
    if (!videoId) {
      showToast("No video ID provided");
      console.error("No video ID provided");
      return;
    }
    const playlistId = playlist._id || playlist.id;
    if (isVideoInPlaylist(playlist)) {
      // Remove from playlist
      removeVideoFromPlaylist.mutate({ videoId, playlistId });
    } else {
      // Add to playlist
      addVideoToPlaylist.mutate({ videoId, playlistId });
    }
  };

  // Check if video is already in playlist
  const isVideoInPlaylist = (playlist) => {
    if (!playlist.videos || !Array.isArray(playlist.videos)) {
      return false;
    }
    // Handle both ObjectId strings and objects
    return playlist.videos.some(
      (video) =>
        video === videoId ||
        video?._id === videoId ||
        video?.toString() === videoId,
      //some means if any of the condition is true then it will return true , some takes callBack function as a parameter
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-muted dark:hover:bg-white/10 rounded-full transition-all duration-300 h-fit group/trigger">
          <MoreVertical className="w-5 h-5 text-muted-foreground/60 group-hover/trigger:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-background/95 dark:bg-black/95 backdrop-blur-xl border border-border dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-satoshi">
        <div className="py-1">
          {/* Nested Popover for Playlist Selection */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-tight text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 text-left">
                <div className="flex items-center gap-3">
                  <ListPlus className="w-4 h-4" />
                  <span>Add to Playlist</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-64 p-2 bg-background/95 dark:bg-black/95 backdrop-blur-xl border border-border dark:border-white/10 shadow-2xl rounded-xl">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-3 py-2">
                  Destination Protocol
                </p>
                {allPlaylists && allPlaylists.length > 0 ? (
                  allPlaylists.map((playlist) => (
                    <button
                      key={playlist._id || playlist.id}
                      onClick={() => handleTogglePlaylist(playlist)}
                      disabled={isLoading}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded transition-colors text-left ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border border-border flex items-center justify-center transition-all ${isVideoInPlaylist(playlist) ? 'bg-primary border-primary scale-110 shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'bg-transparent'}`}>
                          {isVideoInPlaylist(playlist) && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                        </div>
                        <span className="font-medium">{playlist?.name}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 px-3 py-2 text-center">
                    No playlists yet
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VideoCardMenu;
