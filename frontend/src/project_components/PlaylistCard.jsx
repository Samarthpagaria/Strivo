import React from "react";
import { ListVideo, PlayCircle, Heart } from "lucide-react";
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

      {/* Top Bar with Play Button and Badge */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xl opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-white/40 shadow-lg border border-white/20">
          <PlayCircle className="h-6 w-6 fill-white/10" />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md border border-white/20 shadow-lg group-hover:bg-orange-300/30 transition-colors">
          <ListVideo className="h-3.5 w-3.5" />
          <span>{videoCount} VIDEOS</span>
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
