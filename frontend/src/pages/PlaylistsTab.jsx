import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useNavigate } from "react-router-dom";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted/20 animate-pulse rounded-xl border border-border/50" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/5 rounded-3xl border border-dashed border-border/50 mx-4 md:mx-0">
        <div className="w-20 h-20 bg-muted/10 flex items-center justify-center rounded-full mb-6 border border-border/20">
           <ListPlus className="text-muted-foreground/20 w-10 h-10" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">No Collections</h3>
        <p className="text-xs text-muted-foreground/40 font-medium mt-2 max-w-[200px]">This creator hasn't published any playlists yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-10 px-4 md:px-0">
      {data.map((playlist) => (
        <div
          key={playlist._id}
          onClick={() => navigate(`/playlist/${playlist._id}`)}
          className="relative group cursor-pointer h-full"
        >
          {/* Decorative Background for Stacking Effect */}
          <div className="absolute inset-0 bg-primary/20 -rotate-2 rounded-2xl group-hover:rotate-0 transition-transform duration-500 scale-95" />
          
          <div className="relative p-6 bg-muted/30 backdrop-blur-xl border border-border/50 rounded-2xl h-full flex flex-col justify-between transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/10 overflow-hidden">
            <Crosshair className="top-0 right-0" />
            <Crosshair className="bottom-0 left-0" />
            
            <div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 border border-primary/20 group-hover:scale-110 transition-transform">
                    <ListPlus size={18} className="text-primary" />
                </div>
                <h3 className="font-black text-xl text-foreground font-satoshi uppercase tracking-tight line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {playlist.name}
                </h3>
                <p className="text-xs text-muted-foreground/60 font-inter line-clamp-3 leading-relaxed">
                    {playlist.description || "Collection of premium curated content."}
                </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">Last Update</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{new Date(playlist.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background group-hover:bg-primary transition-colors">
                    <ChevronRight size={16} strokeWidth={3} />
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistsTab;
