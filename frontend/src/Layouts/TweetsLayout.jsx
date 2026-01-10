import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import TweetDetails from "../pages/tweets/TweetDetailsPage.Page.jsx";
import TweetNavbar from "../project_components/TweetNavbar.jsx";
import TweetPost from "../project_components/TweetPost.jsx";
import TweetsList from "../project_components/TweetsList.jsx";
// import { MOCK_TWEETS } from "../utils/mockData";
import TweetSearchResults from "../pages/tweets/TweetsResults.Page.jsx";
import { useTweet } from "../ContentApi/TweetContext";

const TweetsLayout = ({ width = 400, onResizeStart }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const tweetsContainerRef = useRef(null);

  const params = new URLSearchParams(search);

  const searchQuery = params.get("q") || ""; // Default to empty string
  const tweetId = params.get("tweetId"); // ?tweetId=777

  //check if we are on the profile channel route ("/@:username")
  const isProfileChannelRoute = pathname.startsWith("/@");

  // Check if we're on the video results page - don't show tweet search there
  const isVideoResultsPage = pathname === "/results";

  const isTweetDetails = !!tweetId;
  // Only show tweet search if there's a query AND we're not on the video results page
  const isSearchMode = !!searchQuery && !isVideoResultsPage;

  // using tweet context
  const { tweetQuery, homeFeedTweetsQuery } = useTweet();

  // remove only tweetId while keeping q or other queries intact
  const handleTweetBack = () => {
    params.delete("tweetId");
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div
      id="tweets-scroll-container"
      ref={tweetsContainerRef}
      style={{ width: `${width}px` }}
      className="border-l border-gray-300 overflow-y-auto relative no-scrollbar"
    >
      {/* Resize Handle */}
      <div
        onMouseDown={onResizeStart}
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors z-50 group"
        style={{ touchAction: "none" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-500 transition-colors" />
        <div className="absolute left-[-3px] top-0 bottom-0 w-2 bg-transparent" />
      </div>

      <div className="sticky top-0 z-50 flex justify-center -mb-24">
        <TweetNavbar scrollContainerRef={tweetsContainerRef} />
      </div>
      <div className="pt-28">
        <TweetPost />
      </div>
      <div className="p-4">
        {homeFeedTweetsQuery.isLoading ? (
          <div className="text-center py-4 text-gray-400">Loading feed...</div>
        ) : isTweetDetails ? (
          <TweetDetails tweetId={tweetId} onBack={handleTweetBack} />
        ) : isSearchMode ? (
          <TweetSearchResults query={searchQuery} />
        ) : isProfileChannelRoute ? (
          <TweetsList
            tweets={tweetQuery.data?.data?.tweets || []}
            emptyMessage="This user hasn't posted any tweets yet."
          />
        ) : (
          <TweetsList
            tweets={homeFeedTweetsQuery.data?.data || []}
            emptyMessage="No tweets in your feed."
          />
        )}
      </div>
    </div>
  );
};

export default TweetsLayout;
