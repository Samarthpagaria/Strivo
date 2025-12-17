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

  console.log("📋 VideoCardMenu - allPlaylists:", allPlaylists);

  const handleTogglePlaylist = (playlist) => {
    if (!videoId) {
      showToast("No video ID provided");
      console.error("No video ID provided");
      return;
    }
    const playlistId = playlist._id || playlist.id;
    if (isVideoInPlaylist(playlist)) {
      // Remove from playlist
      console.log("Removing video from playlist:", { videoId, playlistId });
      removeVideoFromPlaylist.mutate({ videoId, playlistId });
    } else {
      // Add to playlist
      console.log("Adding video to playlist:", { videoId, playlistId });
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
        video?.toString() === videoId
      //some means if any of the condition is true then it will return true , some takes callBack function as a parameter
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1 hover:bg-gray-300 rounded-full transition-colors h-fit">
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 border-none shadow-lg">
        <div className="py-1">
          {/* Nested Popover for Playlist Selection */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <ListPlus className="w-4 h-4" />
                  <span>Add to Playlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-56 p-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 px-2 py-1">
                  Select Playlist
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
                      <span>{playlist?.name}</span>
                      <input
                        type="checkbox"
                        className="w-4 h-4  pointer-events-none  "
                        checked={isVideoInPlaylist(playlist)}
                        readOnly
                      />
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
