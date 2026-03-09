import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "../ContentApi/GlobalContext";
import VideoCard from "../project_components/VideoCard";
import { ArrowLeft, PlayCircle } from "lucide-react";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const { token } = useGlobal();
  const navigate = useNavigate();

  const {
    data: playlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/${playlistId}`,
        config,
      );
      // The backend returns { data: playlistObject } via ApiResponse
      return res.data.data;
    },
    enabled: !!playlistId,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Playlist not found</h2>
        <p className="text-gray-500">
          The playlist you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const videos = playlist.videos || [];

  return (
    <div className="w-full relative min-h-screen bg-gray-50 pb-12">
      {/* Header Area */}
      <div className="w-full bg-linear-to-r from-neutral-800 to-neutral-900 text-white pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          {/* Playlist Thumbnail (uses first video or placeholder) */}
          <div className="w-full md:w-80 aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-800 shrink-0 relative group">
            <img
              src={
                videos[0]?.thumbnail ||
                "https://picsum.photos/seed/playlist/600/400"
              }
              alt={playlist.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PlayCircle className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex-1 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl md:text-5xl font-bold font-sans">
              {playlist.name}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              {playlist.description || "No description provided."}
            </p>

            <div className="flex gap-4 text-sm font-medium text-gray-400 pt-4">
              <span>{videos.length} videos</span>
              <span>•</span>
              <span>
                Updated {new Date(playlist.updatedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Play All Button */}
            {videos.length > 0 && (
              <button
                onClick={() => navigate(`/watch/${videos[0]._id}`)}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                <PlayCircle className="w-5 h-5 fill-current" />
                Play All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos List Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
          Playlist Videos
        </h2>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                _id={video._id}
                title={video.title}
                owner={video.owner?.[0] || video.owner || playlist.owner}
                views={video.views}
                createdAt={video.createdAt}
                thumbnail={video.thumbnail}
                duration={video.duration}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              This playlist has no videos yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;
