import React, { useState } from "react";
import PlaylistCard from "../project_components/PlaylistCard";
import { Plus } from "lucide-react";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import CreatePlaylistModal from "../project_components/CreatePlaylistModal";
import { usePlaylist } from "../ContentApi/PlaylistContext";

function Playlists() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createPlaylist, isCreatingPlaylist, allPlaylists } = usePlaylist();

  const handleCreatePlaylist = (playlistData) => {
    createPlaylist(playlistData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950">
      <div className="relative overflow-hidden">
        <div className="relative px-8 pt-12 pb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                Playlists
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Organize and manage your video collections
              </p>
            </div>

            <HoverBorderGradient
              containerClassName="rounded-full hover:scale-105 transition-transform duration-500"
              className="bg-white dark:bg-white text-black dark:text-black  flex items-center gap-2 group"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Playlist</span>
            </HoverBorderGradient>
          </div>

          <div className="mt-6 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>

      <div className="px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allPlaylists?.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlistId={playlist._id}
              title={playlist.name}
              description={playlist.description}
              videoCount={playlist.videos.length}
              thumbnail={playlist.videos[0]?.thumbnail || playlist.thumbnail}
            />
          ))}
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlaylist}
        isLoading={isCreatingPlaylist}
      />
    </div>
  );
}

export default Playlists;
