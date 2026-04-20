import React, { useState, useRef, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import confetti from "canvas-confetti";
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
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

import PixelCard from "../project_components/PixelCard";
import VideoDetailSidebar from "../project_components/VideoDetailSidebar";
import { useVideoDetail } from "../ContentApi/VideoDetailContext";
import { CommentProvider } from "../ContentApi/CommentContext";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useQueryClient } from "@tanstack/react-query";

const VideoDetailsPage = () => {
  const { videoId } = useParams();
  const { scrollRef } = useOutletContext() || {};
  const queryClient = useQueryClient();

  // Data Fetching
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

  // UI State
  const { user } = useGlobal();

  // Invalidate watch history when a video is viewed
  useEffect(() => {
    if (videoData) {
      queryClient.invalidateQueries(["watchHistory", user?.username]);
    }
  }, [videoData?._id, queryClient, user?.username]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isSubscribedLocal, setIsSubscribedLocal] = useState(false);

  // Sync subscribe state - only update local state when the source data for the owner changes
  useEffect(() => {
    if (videoData?.owner) {
      setIsSubscribedLocal(!!videoData.owner.isSubscribed);
    }
  }, [videoData?.owner?._id, videoData?.owner?.isSubscribed]);

  // Player State
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Scroll Animations
  const { scrollY } = useScroll({ container: scrollRef });
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

  // Effects
  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Utility Handlers
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      videoRef.current.paused
        ? videoRef.current.play()
        : videoRef.current.pause();
      setIsPlaying(!videoRef.current.paused);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setShowSettings(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      videoRef.current.muted = newMuteState;
      if (!newMuteState && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Error loading video</h2>
        <p className="text-gray-600">
          {error?.response?.data?.message || error?.message}
        </p>
      </div>
    );

  if (!videoData) return null;

  return (
    <CommentProvider videoId={videoId}>
      <div className="w-full min-h-screen bg-white">
        <div className="max-w-(--breakpoint-2xl) mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Main Content Column */}
            <div className="flex-1 min-w-0 w-full">
              {/* Sticky Animated Player */}
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
                      onTimeUpdate={() =>
                        setCurrentTime(videoRef.current?.currentTime || 0)
                      }
                      onLoadedMetadata={() =>
                        setDuration(videoRef.current?.duration || 0)
                      }
                    />

                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
                        <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-110 animate-in fade-in zoom-in duration-200">
                          <PlaySquare size={40} fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />

                    {/* Media Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {/* Timeline */}
                      <div
                        className="h-1.5 w-full bg-white/20 rounded-full mb-4 overflow-hidden backdrop-blur-sm cursor-pointer hover:h-2 transition-all group/progress"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pct = (e.clientX - rect.left) / rect.width;
                          if (videoRef.current)
                            videoRef.current.currentTime = pct * duration;
                        }}
                      >
                        <div
                          className="h-full bg-blue-500 rounded-full relative"
                          style={{
                            width: `${(currentTime / duration) * 100}%`,
                          }}
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

                          {/* Volume */}
                          <div
                            className="flex items-center gap-3 group/volume relative"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                          >
                            <button
                              onClick={toggleMute}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX size={20} />
                              ) : volume < 0.5 ? (
                                <Volume1 size={20} />
                              ) : (
                                <Volume2 size={20} />
                              )}
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 flex items-center ${showVolumeSlider ? "w-20" : "w-0"}`}
                            >
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-blue-500 hover:bg-white/50 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                              />
                            </div>
                          </div>

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
                          {/* Speed Settings */}
                          <div className="relative">
                            <button
                              onClick={() => setShowSettings(!showSettings)}
                              className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md flex items-center gap-2"
                            >
                              {playbackSpeed}x <MoreHorizontal size={14} />
                            </button>

                            {showSettings && (
                              <div className="absolute bottom-full right-0 mb-4 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <p className="text-[9px] font-black uppercase tracking-tighter text-white/30 px-3 py-2 border-b border-white/5">
                                  Speed
                                </p>
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

              {/* Video Info Section */}
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold font-satoshi text-gray-900 leading-tight mb-1">
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

                {/* Creator Profile */}
                <div className="bg-gray-50/50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={videoData.owner.avatar}
                      alt=""
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold font-satoshi text-gray-900">
                        {videoData.owner.fullName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {videoData.owner.subscribersCount} Subscribers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const beingSubscribed = !isSubscribedLocal;

                      if (beingSubscribed) {
                        confetti({
                          particleCount: 80,
                          spread: 70,
                          origin: {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y:
                              (rect.top + rect.height / 2) / window.innerHeight,
                          },
                          colors: [
                            "#3b82f6",
                            "#ef4444",
                            "#10b981",
                            "#f59e0b",
                            "#6366f1",
                            "#ec4899",
                            "#8b5cf6",
                          ],
                          ticks: 200,
                          gravity: 1.2,
                          scalar: 0.6, // Smaller particles
                          drift: 0,
                        });
                      }

                      toggleSubscriptionMutation.mutate(videoData.owner._id, {
                        onSuccess: () => {
                          setIsSubscribedLocal(!isSubscribedLocal);
                        },
                      });
                    }}
                    disabled={toggleSubscriptionMutation.isPending}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                      isSubscribedLocal
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-black text-white hover:bg-slate-800"
                    } ${user?._id === videoData.owner._id ? "hidden" : ""}`}
                  >
                    {isSubscribedLocal ? (
                      <>
                        <Bell size={14} fill="currentColor" />
                        Subscribed
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>

                {/* Description Box */}
                <div className="prose prose-sm max-w-none font-inter text-gray-600 leading-relaxed bg-gray-50/30 p-4 rounded-xl border border-gray-100/50">
                  <p className="whitespace-pre-wrap">{videoData.description}</p>
                </div>
              </div>
            </div>

            {/* Interactive Sidebar */}
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
