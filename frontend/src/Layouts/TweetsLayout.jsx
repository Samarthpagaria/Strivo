import { useLocation, useNavigate } from "react-router-dom";
import TweetSearchResults from "../pages/tweets/TweetsResults.Page.jsx";
import TweetDetails from "../pages/tweets/TweetDetailsPage.Page.jsx";
import TweetNavbar from "../project_components/TweetNavbar.jsx";
const HomeTweets = () => (
  <div className="space-y-3">
    <div className="p-3 bg-white rounded-lg shadow-sm">Random home tweet 1</div>
    <div className="p-3 bg-white rounded-lg shadow-sm">Random home tweet 2</div>
  </div>
);

const TweetsLayout = ({ width = "w-80" }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  // Parse query params cleanly
  const params = new URLSearchParams(search);

  const searchQuery = params.get("q"); // ?q=react
  const tweetId = params.get("tweetId"); // ?tweetId=777

  const isSearchPage = pathname === "/results" && !!searchQuery;
  const isTweetDetails = !!tweetId;

  // remove only tweetId while keeping q or other queries intact
  const handleTweetBack = () => {
    params.delete("tweetId");
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div
      className={`${width} bg-gray-50 border-l border-gray-200 overflow-y-auto`}
    >
      <div className="relative flex justify-center ">
        <TweetNavbar className="relative " />
      </div>
      <div className="p-4">
        {isTweetDetails ? (
          <TweetDetails tweetId={tweetId} onBack={handleTweetBack} />
        ) : isSearchPage ? (
          <TweetSearchResults query={searchQuery} />
        ) : (
          <HomeTweets />
        )}
      </div>
    </div>
  );
};

export default TweetsLayout;
