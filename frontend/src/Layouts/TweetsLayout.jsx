import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import TweetSearchResults from "../pages/tweets/TweetsResults.Page.jsx";
import TweetDetails from "../pages/tweets/TweetDetailsPage.Page.jsx";
import TweetNavbar from "../project_components/TweetNavbar.jsx";
import TweetPost from "../project_components/TweetPost.jsx";
import Tweet from "../project_components/Tweet.jsx";

const HomeTweets = () => (
  <div>
    <Tweet
      username="Sarah Chen"
      handle="@sarahchen"
      timestamp="3h"
      content="Just launched my new portfolio website! 🎨✨ Check it out and let me know what you think! #WebDev #Design"
      avatar="https://picsum.photos/id/64/48/48"
      replies={24}
      retweets={89}
      likes={342}
    />
    <Tweet
      username="Tech Daily"
      handle="@techdaily"
      timestamp="5h"
      content="Breaking: New JavaScript framework announced! 🚀

Features:
• Zero config
• Built-in TypeScript
• Lightning fast
• Developer friendly

What do you think? 🤔"
      avatar="https://picsum.photos/id/65/48/48"
      replies={156}
      retweets={423}
      likes={1205}
    />
    <Tweet
      username="Alex Rivera"
      handle="@alexrivera"
      timestamp="8h"
      content="Coffee + Code = ❤️

Currently debugging a tricky issue. Anyone else coding on a Sunday? ☕️💻"
      avatar="https://picsum.photos/id/66/48/48"
      replies={45}
      retweets={12}
      likes={234}
    />
    <Tweet
      username="Design Inspiration"
      handle="@designinspo"
      timestamp="12h"
      content="Beautiful color palette for your next project 🎨

#FF6B6B - Coral Red
#4ECDC4 - Turquoise
#45B7D1 - Sky Blue
#FFA07A - Light Salmon

Save this for later! 📌"
      avatar="https://picsum.photos/id/67/48/48"
      replies={67}
      retweets={234}
      likes={892}
    />
  </div>
);

const TweetsLayout = ({ width = "w-80" }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const tweetsContainerRef = useRef(null);

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
      id="tweets-scroll-container"
      ref={tweetsContainerRef}
      className={`${width} bg-gray-50 border-l-[1px] border-gray-300 overflow-y-auto`}
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
