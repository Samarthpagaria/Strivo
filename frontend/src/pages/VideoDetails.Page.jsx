import React, { useState, useRef, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
  Bell,
  MessageSquare,
  PlaySquare,
  Info,
  ListPlus,
  Twitter,
} from "lucide-react";
import PixelCard from "../project_components/PixelCard";
import VideoDetailSidebar from "../project_components/VideoDetailSidebar";
import { useVideoDetail } from "../ContentApi/VideoDetailContext";
import { formatDistanceToNow } from "date-fns";

// Dummy data for development (re-used)
const MOCK_VIDEO = {
  id: "1",
  title: "Building a Full Stack YouTube Clone with React & Node.js",
  description:
    "In this masterclass, we will build a complete YouTube clone from scratch. We'll cover backend API design, database schema, frontend integration, and advanced features like video uploading and streaming.\n\nTimestamps:\n00:00 - Introduction\n05:20 - Backend Setup\n15:45 - Database Schema\n...",
  views: "125K",
  uploadedAt: "2 weeks ago",
  likes: "4.5K",
  channel: {
    name: "Code Master",
    subscribers: "1.2M",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster",
  },
};

const MORE_VIDEOS = Array(12)
  .fill(null)
  .map((_, i) => ({
    id: i,
    title: `Learn React in 202${i} - Full Course for Beginners`,
    channel: "Frontend Daily",
    views: `${(i + 1) * 10}K`,
    uploadedAt: `${i + 1} days ago`,
    thumbnail: `https://picsum.photos/seed/${i + 100}/320/180`,
  }));

const COMMENTS = [
  {
    id: 1,
    user: "DevUser1",
    text: "This is exactly what I was looking for! Thanks!",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "ReactFan",
    text: "Great explanation of hooks.",
    time: "5 hours ago",
  },
  {
    id: 3,
    user: "NewbieCoder",
    text: "Can you make a video on Redux?",
    time: "1 day ago",
  },
];

const VideoDetailsPage = () => {
  const { videoId } = useParams();
  const { scrollRef } = useOutletContext() || {};
  const {
    data: videoData,
    isLoading,
    isError,
    error,
    toggleVideoLikeMutation,
    toggleSubscriptionMutation,
  } = useVideoDetail(videoId);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const playerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scroll Animation Logic
  // IMPORTANT: We must pass the container ref to track the correct scrollable element
  const { scrollY } = useScroll({
    container: scrollRef,
  });

  // Ultra-smooth scroll animations with many checkpoints
  const width = useTransform(
    scrollY,
    [0, 50, 100, 150, 200, 300, 400, 500, 600, 800],
    ["100%", "98%", "95%", "92%", "88%", "82%", "78%", "74%", "72%", "70%"]
  );
  const borderRadius = useTransform(
    scrollY,
    [0, 50, 100, 150, 200, 300, 400, 500, 600, 800],
    [0, 4, 8, 12, 16, 20, 24, 28, 30, 32]
  );
  const y = useTransform(scrollY, [0, 800], [0, 0]); // Keep it pinned properly
  const paddingInline = useTransform(scrollY, [0, 800], ["0rem", "0rem"]); // No extra padding needed if width shrinks

  // Fullscreen functionality
  const handleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes (e.g., ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Error loading video</h2>
        <p className="text-gray-600">
          {error?.response?.data?.message || error?.message}
        </p>
      </div>
    );
  }

  if (!videoData) return null;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Unified Layout Container */}
      <div className="max-w-(--breakpoint-2xl) mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column: Player & Overview */}
          <div className="flex-1 min-w-0 w-full">
            {/* Animated Player Section - Now part of the column but still sticky */}
            <div className="sticky top-4 z-40 bg-white/90 backdrop-blur-sm py-2 mb-2">
              <div className="flex justify-center origin-top">
                <motion.div
                  ref={playerRef}
                  layout
                  style={{ width, borderRadius }}
                  className="max-w-full aspect-video bg-black shadow-2xl relative overflow-hidden ring-1 ring-black/5 group mx-auto"
                >
                  {/* Simulated Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <video
                      src={videoData.videoFile}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Player Controls Overlay (Mock) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-1 bg-gray-600 rounded-full mb-4 overflow-hidden">
                      <div className="h-full w-1/3 bg-red-600"></div>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <div className="flex gap-4">
                        <button className="text-sm hover:text-gray-300">
                          Play
                        </button>
                        <button className="text-sm hover:text-gray-300">
                          Volume
                        </button>
                        <span className="text-xs opacity-70">
                          05:20 / 15:45
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <button className="text-sm hover:text-gray-300 transition-colors">
                          Settings
                        </button>
                        <button
                          onClick={handleFullscreen}
                          className="text-sm hover:text-gray-300 transition-colors"
                        >
                          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Header: Title & Actions */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-1">
                    {videoData.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{videoData.views} views</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(videoData.createdAt))} ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator Card */}
              <div className="bg-gray-50/50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={videoData.owner.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {videoData.owner.fullName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {videoData.owner.subscribersCount} Subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleSubscriptionMutation.mutate(videoData.owner._id)
                  }
                  disabled={toggleSubscriptionMutation.isPending}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-xs ${
                    videoData.owner.isSubscribed
                      ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {videoData.owner.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed bg-gray-50/30 p-4 rounded-xl border border-gray-100/50">
                <p className="whitespace-pre-wrap">{videoData.description}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <VideoDetailSidebar
            comments={COMMENTS}
            relatedVideos={MORE_VIDEOS}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            videoData={videoData}
            isSubscribed={videoData.owner.isSubscribed}
            onLike={() => toggleVideoLikeMutation.mutate(videoData._id)}
            onDislike={() => console.log("Disliked")}
            onPlaylist={() => console.log("Added to playlist")}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
