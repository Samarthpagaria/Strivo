import React, { useMemo } from "react";
import Tweet from "../../pages/Tweet";
import { MOCK_TWEETS } from "../../utils/mockData";

const TweetResults = ({ query }) => {
  const filteredTweets = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return MOCK_TWEETS.filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(lowerQuery) ||
        tweet.username.toLowerCase().includes(lowerQuery) ||
        tweet.handle.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Showing tweets for “{query}”</p>

      {filteredTweets.length > 0 ? (
        filteredTweets.map((tweet) => (
          <Tweet key={tweet.id || tweet._id} {...tweet} />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          No tweets found matching "{query}"
        </div>
      )}
    </div>
  );
};

export default TweetResults;
