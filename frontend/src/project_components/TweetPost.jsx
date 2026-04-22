import React, { useState, useEffect } from "react";
import { useTweet } from "../ContentApi/TweetContext";
import {
  Files,
  Film,
  Smile,
  MapPin,
  X,
  PlaySquare,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobal } from "../ContentApi/GlobalContext";
const TweetPost = ({
  parentTweetId = null,
  onPostSuccess = null,
  isReply = false,
}) => {
  const [tweetText, setTweetText] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoMention, setVideoMention] = useState(null);
  const maxLength = 500;

  const { user } = useGlobal();
  const { createTweet, prefillTweet, setPrefillTweet } = useTweet();

  useEffect(() => {
    if (prefillTweet && !isReply) {
      setTweetText(prefillTweet.content || "");
      if (prefillTweet.videoMention) {
        setVideoMention(prefillTweet.videoMention);
      }
      setPrefillTweet(null); // Clear context once we've grabbed it
    }
  }, [prefillTweet, setPrefillTweet, isReply]);

  const handlePost = async () => {
    if (
      tweetText.trim() ||
      images.length > 0 ||
      videos.length > 0 ||
      videoMention
    ) {
      await createTweet.mutateAsync({
        tweetText,
        images,
        videos,
        videoMention,
        parentTweetId,
      });
      setTweetText("");
      setImages([]);
      setVideos([]);
      setVideoMention(null);
      if (onPostSuccess) onPostSuccess();
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 4 images
    if (images.length + files.length > 4) {
      alert("You can only upload up to 4 images per tweet.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 3 videos
    if (videos.length + files.length > 3) {
      alert("You can only upload up to 3 videos per tweet.");
      return;
    }
    setVideos((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full  ${!isReply ? "border-b border-gray-200 dark:border-white/5 transition-colors" : ""}`}>
      <div className={isReply ? "pt-2 pb-2" : "p-4"}>
        <div className="flex gap-3">
          {/* Avatar */}
          {!isReply && (
            <div className="shrink-0">
              <img
                src={user?.avatar}
                alt="User avatar"
                className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10"
              />
            </div>
          )}

          {/* Tweet Input Area */}
          <div className="flex-1">
            <div
              className={
                isReply
                  ? "rounded-2xl border border-gray-100 dark:border-white/10 p-3 focus-within:border-gray-900 dark:focus-within:border-white/30 transition-all duration-300"
                  : ""
              }
            >
              <div className="flex gap-2">
                {isReply && (
                  <img
                    src={user?.avatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full shrink-0 border border-gray-100 dark:border-white/10"
                  />
                )}
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  placeholder={
                    isReply ? "Post your reply" : "What's happening?"
                  }
                  className={`w-full resize-none border-none outline-none placeholder:font-satoshi font-inter text-slate-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 bg-transparent py-1 ${isReply ? "text-[15px]" : "text-lg font-medium"}`}
                  rows={isReply ? "1" : "3"}
                  style={{ minHeight: isReply ? "40px" : "auto" }}
                  maxLength={maxLength}
                />
              </div>
            </div>

            {videoMention && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold border border-blue-100 dark:border-blue-500/20">
                <PlaySquare className="w-4 h-4" />
                <span>Video Attached</span>
                <button
                  onClick={() => setVideoMention(null)}
                  className="ml-2 hover:bg-blue-100 dark:hover:bg-blue-500/20 p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Media Previews */}
            {(images.length > 0 || videos.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-white/10"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5 shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {videos.map((vid, i) => (
                  <div key={i} className="relative">
                    <video
                      src={URL.createObjectURL(vid)}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-white/10"
                    />
                    <button
                      onClick={() => removeVideo(i)}
                      className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5 shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`flex items-center justify-between mt-3 ${!isReply ? "pt-3 border-t border-gray-100 dark:border-white/5" : ""}`}
            >
              {/* Left side spacer */}
              <div />

              {/* Right side - Media, Character count and Post button */}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id={`image-upload-${parentTweetId || "new"}`}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <input
                  type="file"
                  id={`video-upload-${parentTweetId || "new"}`}
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoSelect}
                />

                <div className="flex items-center gap-0 border border-border/50 dark:border-white/10 rounded-lg overflow-hidden bg-background/50 dark:bg-white/5 font-inter">
                  <Button
                    asChild
                    className="h-8 px-2 text-muted-foreground hover:text-foreground dark:hover:text-white bg-transparent hover:bg-muted/50 dark:hover:bg-white/10 border-r border-border/40 dark:border-white/5 rounded-none font-inter"
                    variant="ghost"
                  >
                    <label htmlFor={`image-upload-${parentTweetId || "new"}`} className="cursor-pointer flex items-center gap-1.5">
                      <Files size={15} strokeWidth={2} />
                      <span className="text-[11px] font-medium tracking-wider font-inter">Files</span>
                    </label>
                  </Button>
                  
                  <Button
                    asChild
                    className="h-8 px-2 text-muted-foreground hover:text-foreground dark:hover:text-white bg-transparent hover:bg-muted/50 dark:hover:bg-white/10 rounded-none font-inter"
                    variant="ghost"
                  >
                    <label htmlFor={`video-upload-${parentTweetId || "new"}`} className="cursor-pointer flex items-center gap-1.5">
                      <Film size={15} strokeWidth={2} />
                      <span className="text-[11px] font-medium tracking-wider font-inter">Video</span>
                    </label>
                  </Button>
                </div>

                {tweetText.length > 0 && (
                  <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600">
                    {tweetText.length}/{maxLength}
                  </span>
                )}
                <button
                  onClick={handlePost}
                  disabled={
                    !tweetText.trim() &&
                    images.length === 0 &&
                    videos.length === 0 &&
                    !videoMention
                  }
                  className={`px-5 py-1.5 rounded-full font-bold font-satoshi text-xs transition-all duration-300 ${
                    tweetText.trim() ||
                    images.length > 0 ||
                    videos.length > 0 ||
                    videoMention
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isReply ? "Reply" : "Post"}
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
