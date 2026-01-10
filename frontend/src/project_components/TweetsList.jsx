import React from "react";
import Tweet from "./Tweet.jsx";

const TweetsList = ({ tweets = [], emptyMessage = "No tweets found" }) => {
  return (
    <div>
      {tweets && tweets.length > 0 ? (
        tweets.map((tweet) => <Tweet key={tweet._id} {...tweet} />)
      ) : (
        <div className="text-center p-4 text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
};

export default TweetsList;
