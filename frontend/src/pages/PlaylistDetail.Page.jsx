import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VideoCard from "../project_components/VideoCard";
import { usePlaylist } from "../ContentApi/PlaylistContext";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  // Use your logic from the Context
  const {
    fetchPlayListById: data,
    isFetchingPlayListById: isLoading,
    setPlaylistId,
  } = usePlaylist();

  // Set the ID in the context so it starts fetching
  useEffect(() => {
    if (playlistId) setPlaylistId(playlistId);
  }, [playlistId, setPlaylistId]);

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;

  const playlist = data?.data;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-2">{playlist?.name}</h1>
        <p className="text-gray-500">
          {playlist?.description || "No description"}
        </p>
        <p className="text-sm mt-2 font-medium text-purple-600">
          {playlist?.videos?.length || 0} Videos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlist?.videos?.map((video) => (
          <VideoCard key={video._id} {...video} />
        ))}
      </div>
    </div>
  );
}

export default PlaylistDetail;
