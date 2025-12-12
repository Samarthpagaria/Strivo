import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import TweetDetails from "../pages/tweets/TweetDetailsPage.Page.jsx";
import TweetNavbar from "../project_components/TweetNavbar.jsx";
import TweetPost from "../project_components/TweetPost.jsx";
import TweetsList from "../project_components/TweetsList.jsx";
import { MOCK_TWEETS } from "../utils/mockData";
import TweetSearchResults from "../pages/tweets/TweetsResults.Page.jsx";
import { useTweet } from "../ContentApi/TweetContext";

const TweetsLayout = ({ width = "w-80" }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const tweetsContainerRef = useRef(null);

  // Parse query params cleanly
  const params = new URLSearchParams(search);

  const searchQuery = params.get("q") || ""; // Default to empty string
  const tweetId = params.get("tweetId"); // ?tweetId=777

  //check if we are on the profile channel route ("/@:username")
  const isProfileChannelRoute = pathname.startsWith("/@");

  const isTweetDetails = !!tweetId;
  const isSearchMode = !!searchQuery;

  // using tweet context
  const { tweetQuery } = useTweet();

  // remove only tweetId while keeping q or other queries intact
  const handleTweetBack = () => {
    params.delete("tweetId");
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div
      id="tweets-scroll-container"
      ref={tweetsContainerRef}
      className={`${width} bg-gray-50 border-l border-gray-300 overflow-y-auto`}
    >
      <div className="sticky top-0 z-50 flex justify-center -mb-24">
        <TweetNavbar scrollContainerRef={tweetsContainerRef} />
      </div>
      <div className="pt-28">
        <TweetPost />
      </div>
      <div className="p-4">
        {isTweetDetails ? (
          <TweetDetails tweetId={tweetId} onBack={handleTweetBack} />
        ) : isSearchMode ? (
          <TweetSearchResults query={searchQuery} />
        ) : isProfileChannelRoute ? (
          <TweetsList
            tweets={tweetQuery.data?.data?.tweets || []}
            emptyMessage="This user hasn't posted any tweets yet."
          />
        ) : (
          /* Replaced HomeTweets/SearchResults with unified list */
          <TweetsList tweets={MOCK_TWEETS} />
        )}
      </div>
    </div>
  );
};

export default TweetsLayout;
