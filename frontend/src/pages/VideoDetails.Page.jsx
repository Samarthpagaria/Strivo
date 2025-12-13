import React, { useState, useRef } from "react";
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
  const { scrollRef } = useOutletContext() || {}; // Access scroll container from RootLayout
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Scroll Animation Logic
  // IMPORTANT: We must pass the container ref to track the correct scrollable element
  const { scrollY } = useScroll({
    container: scrollRef,
  });
  const width = useTransform(scrollY, [0, 300], ["100%", "60%"]); // Animate width to reclaim space
  const borderRadius = useTransform(scrollY, [0, 300], [0, 32]);
  const y = useTransform(scrollY, [0, 300], [0, 0]); // Keep it pinned properly
  const paddingInline = useTransform(scrollY, [0, 300], ["0rem", "0rem"]); // No extra padding needed if width shrinks

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "discussion", label: "Discussion", count: 124, icon: MessageSquare },
    { id: "related", label: "Up Next", icon: PlaySquare },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Cinema Mode Player Section - Sticky & Animated */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100/50 shadow-sm transition-all duration-300">
        <div className="w-full flex justify-center py-4 origin-top">
          <motion.div
            layout
            style={{ width, borderRadius }}
            className="max-w-5xl aspect-video bg-black shadow-2xl relative overflow-hidden ring-1 ring-black/5 group mx-auto"
          >
            {/* Simulated Video Content */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-0 h-0 border-t-15 border-t-transparent border-l-25 border-l-white border-b-15 border-b-transparent ml-2"></div>
                </div>
                <p className="text-white/40 font-medium tracking-wide">
                  CINEMA PLAYER
                </p>
              </div>
            </div>

            {/* Player Controls Overlay (Mock) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-1 bg-gray-600 rounded-full mb-4 overflow-hidden">
                <div className="h-full w-1/3 bg-red-600"></div>
              </div>
              <div className="flex justify-between items-center text-white">
                <div className="flex gap-4">
                  <button>Play</button>
                  <button>Volume</button>
                  <span className="text-sm opacity-80">05:20 / 15:45</span>
                </div>
                <div className="flex gap-4">
                  <button>Settings</button>
                  <button>Fullscreen</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-0">
        {/* Modern Tab Navigation */}
        <div className="flex items-center justify-center mb-8 border-b border-gray-100">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all relative ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.count && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Header: Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {MOCK_VIDEO.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{MOCK_VIDEO.views} views</span>
                    <span>•</span>
                    <span>{MOCK_VIDEO.uploadedAt}</span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-50 p-1 rouned-xl border border-gray-100 rounded-full">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-700">
                      <ThumbsUp size={18} />
                      <span className="font-semibold">{MOCK_VIDEO.likes}</span>
                    </button>
                    <div className="w-px bg-gray-200 my-2"></div>
                    <button className="px-4 py-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-700">
                      <ThumbsDown size={18} />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-100 text-gray-700 font-medium text-sm">
                    <ListPlus size={18} />
                    <span className="hidden sm:inline">Playlist</span>
                  </button>

                  <PixelCard
                    variant="blue"
                    className="w-12 h-12 rounded-full border border-gray-100 bg-gray-50 p-0"
                    gap={4}
                    speed={20}
                    colors="#a855f7,#d8b4fe,#f3e8ff"
                  >
                    <Twitter
                      size={18}
                      className="text-purple-500 relative z-10"
                    />
                  </PixelCard>
                  <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-100 text-gray-700">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Creator Card */}
              <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-4">
                  <img
                    src={MOCK_VIDEO.channel.avatar}
                    alt=""
                    className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {MOCK_VIDEO.channel.name}
                    </h3>
                    <p className="text-gray-500">
                      {MOCK_VIDEO.channel.subscribers} Subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all shadow-sm ${
                    isSubscribed
                      ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{MOCK_VIDEO.description}</p>
              </div>
            </div>
          )}

          {activeTab === "discussion" && (
            <div className="max-w-3xl mx-auto">
              {/* Input */}
              <div className="flex gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  U
                </div>
                <div className="flex-1 relative">
                  <textarea
                    placeholder="Add to the discussion..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all resize-none h-24"
                  />
                  <div className="absolute bottom-3 right-3">
                    <button className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="space-y-6">
                {COMMENTS.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-100 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {comment.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">
                          @{comment.user}
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{comment.text}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                          <ThumbsUp size={14} /> Like
                        </button>
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "related" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {MORE_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="group cursor-pointer flex flex-col gap-3"
                >
                  <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      12:34
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                      {video.channel}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {video.views} • {video.uploadedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
