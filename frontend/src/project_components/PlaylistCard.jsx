import React from "react";
import { ListVideo, PlayCircle, Circle, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({
  playlistId,
  title = "My Awesome Playlist",
  videoCount = 12,
  thumbnail,
  description = "View full collection",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative h-[280px] w-full cursor-pointer overflow-hidden rounded-3xl bg-gray-900 shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
      onClick={() => playlistId && navigate(`/playlists/${playlistId}`)}
    >
      {/* Background Image with Dynamic Blur */}
      <img
        src={
          thumbnail ||
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=1200&fit=crop"
        }
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 blur-xs group-hover:scale-110 group-hover:blur-0"
      />

      {/* Complex Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Bar with Actions and Badge */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
        {/* Action Group: Play & Settings (Horizontal) */}
        <div className="flex flex-row items-center gap-2">
          {/* Play Button */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xl opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-white/40 shadow-lg border border-white/20">
            <PlayCircle className="h-6 w-6 fill-white/10" />
          </div>

          {/* Settings Group (Horizontal Expansion) */}
          <div
            className="group/settings relative flex flex-row items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Actions Button (Circular Dot) */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-2xl opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-white/30 shadow-lg border border-white/10">
              <Circle className="h-2.5 w-2.5 fill-white" />
            </div>

            {/* Sub-buttons (revealed horizontally on Settings hover) */}
            <div className="flex flex-row items-center gap-2 overflow-hidden max-w-0 opacity-0 transition-all duration-700 ease-in-out group-hover/settings:max-w-[120px] group-hover/settings:opacity-100 group-hover/settings:ml-0.5">
              {/* Delete Button */}
              <button
                title="Delete Playlist"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-red-500/10 to-rose-600/10 text-red-100/80 backdrop-blur-xl border border-red-500/20 hover:from-red-500/30 hover:to-rose-600/30 hover:text-red-50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Update Button */}
              <button
                title="Update Playlist"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500/10 to-indigo-600/10 text-blue-100/80 backdrop-blur-xl border border-blue-500/20 hover:from-blue-500/30 hover:to-indigo-600/30 hover:text-blue-50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/20"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur-md border border-white/10 shadow-lg group-hover:bg-orange-300/20 transition-all duration-500">
          <ListVideo className="h-3 w-3" />
          <span className="tracking-widest uppercase">
            {" "}
            {videoCount} VIDEOS{" "}
          </span>
        </div>
      </div>

      {/* Glassmorphic Footer (Description Box) */}
      <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-xl border border-white/0 bg-black/10 p-4 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30 group-hover:backdrop-blur-2xl">
        <div className="flex flex-col">
          <h3 className="text-lg font-extrabold tracking-tight text-white line-clamp-1 drop-shadow-md transition-all duration-500">
            {title}
          </h3>
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:mt-2">
            <p className="overflow-hidden text-[12px] font-medium text-gray-200 line-clamp-1 leading-tight">
              {description || "View collection"}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Shine Effect on Hover */}
      <div className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] rotate-45 bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none" />
    </div>
  );
};

export default PlaylistCard;
