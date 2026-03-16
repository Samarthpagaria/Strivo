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
import { CommentProvider } from "../ContentApi/CommentContext";
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
    relatedVideos,
    isLoadingRelated,
  } = useVideoDetail(videoId);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef(null);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  // Scroll Animation Logic
  // IMPORTANT: We must pass the container ref to track the correct scrollable element
  const { scrollY } = useScroll({
    container: scrollRef,
  });

  // Ultra-smooth scroll animations with many checkpoints
  const width = useTransform(
    scrollY,
    [0, 50, 100, 150, 200, 300, 400, 500, 600, 800],
    ["100%", "98%", "95%", "92%", "88%", "82%", "78%", "74%", "72%", "70%"],
  );
  const borderRadius = useTransform(
    scrollY,
    [0, 50, 100, 150, 200, 300, 400, 500, 600, 800],
    [0, 4, 8, 12, 16, 20, 24, 28, 30, 32],
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
    <CommentProvider videoId={videoId}>
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
                    style={{ width, borderRadius }}
                    className="max-w-full aspect-video bg-black shadow-2xl relative overflow-hidden group mx-auto"
                  >
                    <video
                      ref={videoRef}
                      src={videoData.videoFile}
                      autoPlay
                      loop
                      className="w-full h-full object-contain relative z-10 cursor-pointer"
                      onClick={togglePlay}
                      onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                      onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                    />

                    {/* Play/Pause Large Center Icon Overlay */}
                    {!isPlaying && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none"
                      >
                        <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-110 animate-in fade-in zoom-in duration-200">
                          <PlaySquare size={40} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for Controls */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />

                    {/* Custom Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {/* Progress Bar */}
                      <div 
                        className="h-1.5 w-full bg-white/20 rounded-full mb-4 overflow-hidden backdrop-blur-sm cursor-pointer hover:h-2 transition-all group/progress"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const pct = x / rect.width;
                          if (videoRef.current) {
                            videoRef.current.currentTime = pct * duration;
                          }
                        }}
                      >
                        <div 
                          className="h-full bg-blue-500 rounded-full relative"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={togglePlay}
                            className="hover:text-blue-400 transition-colors"
                          >
                            {isPlaying ? (
                              <div className="flex gap-1.5">
                                <div className="w-1.5 h-5 bg-white rounded-md" />
                                <div className="w-1.5 h-5 bg-white rounded-md" />
                              </div>
                            ) : (
                              <PlaySquare size={24} fill="currentColor" />
                            )}
                          </button>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold tabular-nums">
                              {formatTime(currentTime)}
                            </span>
                            <span className="text-[10px] opacity-40">/</span>
                            <span className="text-xs font-bold tabular-nums opacity-80">
                              {formatTime(duration)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 relative">
                          <div className="relative">
                            <button 
                              onClick={() => setShowSettings(!showSettings)}
                              className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md flex items-center gap-2"
                            >
                              {playbackSpeed}x
                              <MoreHorizontal size={14} />
                            </button>
                            
                            {showSettings && (
                              <div className="absolute bottom-full right-0 mb-4 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <p className="text-[9px] font-black uppercase tracking-tighter text-white/30 px-3 py-2 border-b border-white/5">Speed</p>
                                {[0.5, 1, 1.5, 2].map((speed) => (
                                  <button
                                    key={speed}
                                    onClick={() => handleSpeedChange(speed)}
                                    className={`w-full text-left px-3 py-2.5 text-xs font-bold transition-all ${
                                      playbackSpeed === speed 
                                        ? "text-blue-400 bg-blue-500/10" 
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                                  >
                                    {speed === 1 ? "Normal" : `${speed}x`}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={handleFullscreen}
                            className="hover:text-blue-400 transition-colors p-1"
                          >
                            <Info size={20} />
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
              relatedVideos={relatedVideos}
              isLoadingRelated={isLoadingRelated}
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
    </CommentProvider>
  );
};

export default VideoDetailsPage;
