import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreVertical, ListPlus, ChevronRight } from "lucide-react";
import { usePlaylist } from "../ContentApi/PlaylistContext";

const VideoCardMenu = () => {
  const { allPlaylists } = usePlaylist();

  console.log("📋 VideoCardMenu - allPlaylists:", allPlaylists);

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
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-left"
                    >
                      <span>{playlist?.name}</span>
                      <input type="checkbox" className="w-4 h-4" />
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
