import React from "react";
import { useParams } from "react-router-dom";
const VideoDetailsPage = () => {
  const { videoId } = useParams();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Video Details</h1>
      <p className="text-sm text-gray-500">Video ID: {videoId}</p>

      {/* Video player section */}
      <div className="aspect-video bg-black rounded-xl mb-4 flex items-center justify-center text-white">
        {/* Replace with real player later */}
        <span className="text-sm">Video player placeholder</span>
      </div>

      {/* Video metadata */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          Sample Video Title (will come from API)
        </h2>
        <p className="text-gray-600 text-sm">
          Views • Upload date • Channel name, etc.
        </p>
      </div>

      {/* Description */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">
          Video description will come here. You can also show tags, links, etc.
        </p>
      </div>

      {/* Comments section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-md shadow-sm border">
            Comment example
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
