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
      <div className="p-4 flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground font-satoshi font-medium tracking-tight">Loading assets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (homeFeedQuery.isError) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="text-center">
          <p className="text-destructive mb-4 font-satoshi font-bold">Failed to synchronize assets</p>
          <Button variant="outline" onClick={() => homeFeedQuery.refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const videos = homeFeedQuery.data || [];

  // Empty state
  if (videos.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="text-center">
          <p className="text-muted-foreground font-satoshi font-medium">No assets currently broadcoast</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div 
        className="p-6 grid gap-6 no-scrollbar" 
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {videos.map((video) => {
          return <VideoCard key={video._id} {...video} />;
        })}
      </div>
    </div>
  );
}

export default Home;
