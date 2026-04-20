import React, { useState } from "react";
import PlaylistCard from "../project_components/PlaylistCard";
import { Plus, ListVideo } from "lucide-react";
import CreatePlaylistModal from "../project_components/CreatePlaylistModal";
import { usePlaylist } from "../ContentApi/PlaylistContext";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
    <div className="absolute w-full h-[1px] bg-gray-300" />
    <div className="absolute h-full w-[1px] bg-gray-300" />
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
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      <div className="w-full mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
                <ListVideo size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">Collection</span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-gray-900 tracking-tight">
              Playlists
            </h1>
            <p className="text-sm font-medium font-inter text-gray-500">
              Organize and manage your video collections.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold font-inter hover:bg-gray-900 transition-all"
             >
                <Plus size={14} className="stroke-2" />
                Create Playlist
             </button>
             <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
               <span className="text-xl font-black font-satoshi text-gray-900">{allPlaylists?.length || 0}</span>
               <span className="text-[10px] font-bold font-inter text-gray-400 uppercase tracking-widest">Saved</span>
             </div>
          </div>
        </div>

        {/* Content Section - Tabular Grid */}
        <div className="mt-12">
          {allPlaylists && allPlaylists.length > 0 ? (
            <div className="relative border-t border-l border-gray-200 bg-white">
               {/* Outer Crosshairs for the entire grid container */}
               <Crosshair className="-top-1.5 -left-1.5" />
               <Crosshair className="-top-1.5 -right-1.5" />
               <Crosshair className="-bottom-1.5 -left-1.5" />
               <Crosshair className="-bottom-1.5 -right-1.5" />

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                 {allPlaylists.map((playlist, index) => (
                   <div
                     key={playlist._id}
                     className="relative border-r border-b border-gray-200 p-6 flex flex-col hover:bg-gray-50 transition-colors"
                   >
                     {/* Inner Crosshair for cells */}
                     <Crosshair className="-bottom-1.5 -right-1.5 z-10" />

                     <PlaylistCard
                       playlistId={playlist._id}
                       title={playlist.name}
                       description={playlist.description}
                       videoCount={playlist.videos.length}
                       thumbnail={playlist.videos[0]?.thumbnail || playlist.thumbnail}
                     />
                   </div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 relative border border-gray-200 bg-gray-50/30">
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />
              
              <div className="p-6 bg-white border border-gray-100 rounded-full mb-6 relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <ListVideo size={40} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                <div className="absolute -bottom-2 -right-2 bg-black text-white p-1 rounded-full group-hover:scale-110 transition-transform">
                  <Plus size={16} />
                </div>
              </div>
              <h3 className="text-xl font-black font-satoshi text-gray-900 uppercase tracking-tight">Timeline Empty</h3>
              <p className="text-sm font-medium font-inter text-gray-400 mt-2 max-w-xs text-center">
                Your playlists collection is currently empty. Start organizing your videos.
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
