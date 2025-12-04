import React from "react";

const TweetDetails = ({ tweetId, onBack }) => {
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-blue-600 text-sm mb-2">
        ← Back
      </button>

      <h2 className="text-xl font-bold">Tweet Details</h2>

      <div className="p-3 bg-white rounded-lg shadow">
        Showing full tweet for ID: {tweetId}
      </div>

      {/* replies / comments etc */}
      <div className="mt-4 space-y-2">
        <div className="p-2 bg-gray-100 rounded">Reply 1...</div>
        <div className="p-2 bg-gray-100 rounded">Reply 2...</div>
      </div>
    </div>
  );
};

export default TweetDetails;
