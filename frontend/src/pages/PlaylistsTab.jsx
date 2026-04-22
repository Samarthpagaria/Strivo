import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";

const PlaylistsTab = ({ userId }) => {
  const { token } = useGlobal();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["channelPlaylists", userId],
    queryFn: async () => {
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/user/${userId}`,
        config,
      );
      return res.data.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Loading playlists...</p>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500 mb-2">
          This channel has not created any playlists yet.
        </p>
      </div>
    );
  }

  const Crosshair = ({ className }) => (
    <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
      <div className="absolute w-full h-[1px] bg-border" />
      <div className="absolute h-full w-[1px] bg-border" />
    </div>
  );

  return (
    <div className="relative border-t border-l border-border">
      {/* Outer Corner Crosshairs */}
      <Crosshair className="-top-1.5 -left-1.5 z-20" />
      <Crosshair className="-top-1.5 -right-1.5 z-20" />
      <Crosshair className="-bottom-1.5 -left-1.5 z-20" />
      <Crosshair className="-bottom-1.5 -right-1.5 z-20" />

      <div 
        className="grid" 
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {data.map((playlist) => (
          <div
            key={playlist._id}
            onClick={() => navigate(`/playlists/${playlist._id}`)}
            className="p-6 transition-all cursor-pointer group relative border-r border-b border-border hover:bg-muted/50 flex flex-col"
          >
            <Crosshair className="-bottom-1.5 -right-1.5 z-10" />
            
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <PlayCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                  {playlist.videos?.length || 0} Videos
              </div>
            </div>

            <h3 className="font-bold text-[15px] text-foreground mb-2 group-hover:text-primary transition-colors font-satoshi truncate">
              {playlist.name}
            </h3>
            <p className="text-[13px] text-muted-foreground line-clamp-2 font-inter mb-4 leading-relaxed">
              {playlist.description || "No description provided."}
            </p>
            
            <div className="mt-auto pt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                Updated {new Date(playlist.updatedAt).toLocaleDateString()}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">View →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsTab;
