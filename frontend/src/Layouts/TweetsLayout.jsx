import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import TweetDetails from "../pages/tweets/TweetDetailsPage.Page.jsx";
import TweetNavbar from "../project_components/TweetNavbar.jsx";
import TweetPost from "../project_components/TweetPost.jsx";
import Tweet from "../project_components/Tweet.jsx";
import { MOCK_TWEETS } from "../utils/mockData";
import TweetSearchResults from "../pages/tweets/TweetsResults.Page.jsx";

const TweetsList = ({ tweets }) => (
  <div>
    {tweets.length > 0 ? (
      tweets.map((tweet) => (
        <Tweet
          key={tweet.id || tweet._id} // Flexible id check
          {...tweet}
        />
      ))
    ) : (
      <div className="text-center p-4 text-gray-500">No tweets found</div>
    )}
  </div>
);

const TweetsLayout = ({ width = "w-80" }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const tweetsContainerRef = useRef(null);

  // Parse query params cleanly
  const params = new URLSearchParams(search);

  const searchQuery = params.get("q") || ""; // Default to empty string
  const tweetId = params.get("tweetId"); // ?tweetId=777

  const isTweetDetails = !!tweetId;
  const isSearchMode = !!searchQuery;

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
        ) : (
          /* Replaced HomeTweets/SearchResults with unified list */
          <TweetsList tweets={MOCK_TWEETS} />
        )}
      </div>
    </div>
  );
};

export default TweetsLayout;
