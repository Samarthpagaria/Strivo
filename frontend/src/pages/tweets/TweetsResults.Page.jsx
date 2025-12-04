import React from "react"; // sirf right section ke liye, ROUTE nahi hai
function TweetResults({ query }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Showing tweets for “{query}”</p>

      {/* Yahan map karke tweets show karo */}
      <div className="p-3 bg-white rounded-lg shadow-sm">
        Tweet result example
      </div>
    </div>
  );
}

export default TweetResults;
