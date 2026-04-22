import React, { useState } from "react";
import PlaylistCard from "../project_components/PlaylistCard";
import { Plus, ListVideo } from "lucide-react";
import CreatePlaylistModal from "../project_components/CreatePlaylistModal";
import { usePlaylist } from "../ContentApi/PlaylistContext";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div
    className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}
  >
    <div className="absolute w-full h-[1px] bg-border dark:bg-white/10" />
    <div className="absolute h-full w-[1px] bg-border dark:bg-white/10" />
  </div>
);

function Playlists() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createPlaylist, isCreatingPlaylist, allPlaylists } = usePlaylist();

  const handleCreatePlaylist = (playlistData) => {
    createPlaylist(playlistData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden transition-colors duration-300">
      <div className="w-full mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border dark:border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <ListVideo size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">
                Collection
              </span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-foreground tracking-tight">
              Playlists
            </h1>
            <p className="text-sm font-medium font-inter text-muted-foreground/80">
              Organize and manage your video collections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-xs font-black font-satoshi uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-foreground/10"
            >
              <Plus size={14} className="stroke-2" />
              Create Playlist
            </button>
            <div className="px-4 py-2 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 flex items-center gap-3">
              <span className="text-xl font-black font-satoshi text-foreground">
                {allPlaylists?.length || 0}
              </span>
              <span className="text-[10px] font-bold font-inter text-muted-foreground/60 uppercase tracking-widest">
                Saved
              </span>
            </div>
          </div>
        </div>

        {/* Content Section - Tabular Grid */}
        <div className="mt-12">
          {allPlaylists && allPlaylists.length > 0 ? (
            <div className="relative border-t border-l border-border dark:border-white/10 bg-background transition-all">
              {/* Outer Crosshairs for the entire grid container */}
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />

              <div 
                className="grid" 
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
              >
                {allPlaylists.map((playlist, index) => (
                  <div
                    key={playlist._id}
                    className="relative border-r border-b border-border dark:border-white/10 p-6 flex flex-col hover:bg-muted/30 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Inner Crosshair for cells */}
                    <Crosshair className="-bottom-1.5 -right-1.5 z-10" />

                    <PlaylistCard
                      playlistId={playlist._id}
                      title={playlist.name}
                      description={playlist.description}
                      videoCount={playlist.videos.length}
                      thumbnail={
                        playlist.videos[0]?.thumbnail || playlist.thumbnail
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 relative border border-border dark:border-white/10 bg-muted/10">
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />

              <div
                className="p-8 bg-background dark:bg-black border border-border dark:border-white/10 rounded-full mb-6 relative group cursor-pointer shadow-xl shadow-primary/5"
                onClick={() => setIsModalOpen(true)}
              >
                <ListVideo
                  size={42}
                  className="text-muted-foreground/20 group-hover:text-primary transition-colors duration-500"
                />
                <div className="absolute -bottom-2 -right-2 bg-foreground text-background p-1.5 rounded-full group-hover:scale-110 transition-transform shadow-lg">
                  <Plus size={18} />
                </div>
              </div>
              <h3 className="text-xl font-black font-satoshi text-foreground uppercase tracking-tight">
                Timeline Empty
              </h3>
              <p className="text-sm font-medium font-inter text-muted-foreground/60 mt-3 max-w-xs text-center leading-relaxed">
                Your playlists collection is currently offline. Initiate creation to organize your assets.
              </p>
            </div>
          )}
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
