import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VideoCard from "../project_components/VideoCard.jsx";
import { useVideo } from "../ContentApi/VideoContext";

function Home() {
  const navigate = useNavigate();
  const { homeFeedQuery } = useVideo();

  // Loading state
  if (homeFeedQuery.isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (homeFeedQuery.isError) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load videos</p>
          <Button onClick={() => homeFeedQuery.refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const videos = homeFeedQuery.data || [];

  // Empty state
  if (videos.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No videos available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 grid lg:grid-cols-3 gap-2 no-scrollbar">
        {videos.map((video) => {
          return <VideoCard key={video._id} {...video} />;
        })}
      </div>
    </>
  );
}

export default Home;
