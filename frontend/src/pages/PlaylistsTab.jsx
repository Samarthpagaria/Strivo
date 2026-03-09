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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((playlist) => (
        <div
          key={playlist._id}
          onClick={() => navigate(`/playlist/${playlist._id}`)}
          className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
            {playlist.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {playlist.description || "No description provided."}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
            <span>
              Updated {new Date(playlist.updatedAt).toLocaleDateString()}
            </span>
            <span className="font-semibold text-gray-800">View Playlist →</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistsTab;
