import React from "react";
import { useVideo } from "../ContentApi/VideoContext";
import VideoCard from "../project_components/VideoCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VideosTab = () => {
  const { videos, isLoading, page, setPage, pagination } = useVideo();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 py-10 px-4 md:px-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-video bg-muted/40 rounded-xl border border-border/50" />
            <div className="h-4 bg-muted/40 rounded-full w-3/4" />
            <div className="h-3 bg-muted/40 rounded-full w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-muted/10 flex items-center justify-center rounded-full mb-4 border border-border/50">
           <PlaySquare className="text-muted-foreground/30 w-8 h-8" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">No Content Available</h3>
        <p className="text-xs text-muted-foreground/50 font-medium mt-1">This channel hasn't uploaded any videos yet.</p>
      </div>
    );
  }

  const totalPages = pagination?.totalPages || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="py-10 px-4 md:px-0">
      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 transition-all duration-500">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            _id={video._id}
            title={video.title}
            owner={video.owner?.[0] || video.owner}
            views={video.views}
            createdAt={video.createdAt}
            thumbnail={video.thumbnail}
            duration={video.duration}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 mt-16 pt-8">
           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              Navigation Entry {page} / {totalPages}
           </div>

          <div className="flex items-center gap-2">
            <button
                onClick={() => setPage(page - 1)}
                disabled={!hasPrevPage}
                className={`p-2 rounded-md border transition-all ${
                hasPrevPage
                    ? "border-border bg-muted/20 text-foreground hover:bg-primary/10 hover:border-primary/30 active:scale-95"
                    : "border-border/20 text-muted-foreground/20 cursor-not-allowed"
                }`}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 text-[10px] font-black rounded-md transition-all flex items-center justify-center ${
                            page === i + 1 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:bg-muted/30"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNextPage}
                className={`p-2 rounded-md border transition-all ${
                hasNextPage
                    ? "border-border bg-muted/20 text-foreground hover:bg-primary/10 hover:border-primary/30 active:scale-95"
                    : "border-border/20 text-muted-foreground/20 cursor-not-allowed"
                }`}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
  );
};

export default VideosTab;
