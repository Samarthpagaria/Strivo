import React, { useMemo } from "react";
import TweetsList from "../../project_components/TweetsList.jsx";
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

      <TweetsList
        tweets={filteredTweets}
        emptyMessage={`No tweets found matching "${query}"`}
      />
    </div>
  );
};

export default TweetResults;
