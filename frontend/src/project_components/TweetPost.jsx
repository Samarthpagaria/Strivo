import React, { useState } from "react";
import { Image, Smile, Calendar, MapPin } from "lucide-react";

const TweetPost = () => {
  const [tweetText, setTweetText] = useState("");
  const maxLength = 280;

  const handlePost = () => {
    if (tweetText.trim()) {
      console.log("Posting tweet:", tweetText);
      setTweetText("");
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <img
              src="https://picsum.photos/id/10/40/40?grayscale&blur=2"
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>

          {/* Tweet Input Area */}
          <div className="flex-1">
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="What's happening?"
              className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 bg-transparent"
              rows="3"
              maxLength={maxLength}
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              {/* Left side - Media buttons */}
              <div className="flex gap-1">
                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
                  <Image className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
                  <Smile className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </button>
              </div>

              {/* Right side - Character count and Post button */}
              <div className="flex items-center gap-3">
                {tweetText.length > 0 && (
                  <span
                    className={`text-sm ${
                      tweetText.length > maxLength * 0.9
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {tweetText.length}/{maxLength}
                  </span>
                )}
                <button
                  onClick={handlePost}
                  disabled={!tweetText.trim()}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    tweetText.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-300 text-white cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetPost;
