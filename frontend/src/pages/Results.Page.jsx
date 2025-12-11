import { useLocation, useNavigate } from "react-router-dom";
import VideoListCard from "../project_components/VideoListCard";
import React, { useMemo } from "react";
import { MOCK_VIDEOS } from "../utils/mockData";

function Results() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  const filteredVideos = useMemo(() => {
    if (!query) return MOCK_VIDEOS;
    const lowerQuery = query.toLowerCase();
    return MOCK_VIDEOS.filter(
      (video) =>
        video.title.toLowerCase().includes(lowerQuery) ||
        video.channel.toLowerCase().includes(lowerQuery) ||
        video.description.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoListCard key={video._id} {...video} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p>Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
