import React from "react";
import { useVideo } from "../ContentApi/VideoContext";
import VideoCard from "../project_components/VideoCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VideosTab = () => {
  const { videos, isLoading, page, setPage, pagination } = useVideo();

  const Crosshair = ({ className }) => (
    <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
      <div className="absolute w-full h-[1px] bg-border" />
      <div className="absolute h-full w-[1px] bg-border" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Loading videos...</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No videos found</p>
      </div>
    );
  }

  const totalPages = pagination?.totalPages || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <>
      {/* Videos Grid */}
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
            {videos.map((video) => (
              <div 
                key={video._id}
                className="relative border-r border-b border-border p-4 hover:bg-muted/30 transition-colors group"
              >
                <Crosshair className="-bottom-1.5 -right-1.5 z-10" />
                <VideoCard
                    _id={video._id}
                    title={video.title}
                    owner={video.owner?.[0] || video.owner}
                    views={video.views}
                    createdAt={video.createdAt}
                    thumbnail={video.thumbnail}
                    duration={video.duration}
                />
              </div>
            ))}
          </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              hasPrevPage
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page <strong className="text-gray-900">{page}</strong> of{" "}
              <strong className="text-gray-900">{totalPages}</strong>
            </span>
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              hasNextPage
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default VideosTab;
