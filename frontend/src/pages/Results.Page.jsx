import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteSearchVideos } from "../ContentApi/SearchContext";
import VideoListCard from "../project_components/VideoListCard";

function Results() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get("q") || "";

  const handleVideoClick = useCallback(
    (videoId) => {
      navigate(`/watch/${videoId}`);
    },
    [navigate]
  );

  // Intersection observer hook - triggers when element comes into view
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Infinite query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteSearchVideos(query);

  // Auto-load more when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array of videos
  const allVideos = data?.pages.flatMap((page) => page.data.videos) || [];
  console.log(allVideos);
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        {query && (
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Results Segment</p>
            <h1 className="text-3xl font-black font-satoshi text-foreground tracking-tight">
              "{query}"
            </h1>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-destructive">
            <h2 className="text-xl font-black font-satoshi uppercase tracking-tight mb-2">Discovery Error</h2>
            <p className="text-sm font-medium text-muted-foreground/60">{error?.message || "Something went wrong. Please try again."}</p>
          </div>
        )}

        {!query && !isLoading && (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-xl font-black font-satoshi uppercase tracking-tight mb-2">Initiate Search</h2>
            <p className="text-sm font-medium text-muted-foreground/60 font-inter">Enter a term to begin exploration.</p>
          </div>
        )}

        {!isLoading && allVideos.length > 0 && (
          <>
            {allVideos.map((video) => (
              <VideoListCard
                key={video._id}
                {...video}
                onClick={() => handleVideoClick(video._id)}
              />
            ))}
          </>
        )}

        {!isLoading && query && allVideos.length === 0 && !isError && (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-xl font-black font-satoshi uppercase tracking-tight mb-2">No results found</h2>
            <p className="text-sm font-medium text-muted-foreground/60 font-inter">Try broadening your search criteria.</p>
          </div>
        )}

        {hasNextPage && (
          <div ref={ref} className="py-8">
            {isFetchingNextPage && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-gray-600">
                  Loading more videos...
                </span>
              </div>
            )}
          </div>
        )}

        {!hasNextPage && allVideos.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've reached the end of the results</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
