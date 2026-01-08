import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  PlaySquare,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  X,
  ThumbsDown,
  ListPlus,
  Twitter,
} from "lucide-react";
import PixelCard from "./PixelCard";

const VideoDetailSidebar = ({
  comments = [],
  relatedVideos = [],
  isOpen,
  setIsOpen,
  videoData,
  onLike,
  onDislike,
  onPlaylist,
  isSubscribed,
  setIsSubscribed,
}) => {
  const [activeTab, setActiveTab] = useState(null); // null means drawer is closed

  const handleTabClick = (tabId) => {
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setIsOpen(true);
      setActiveTab(tabId);
    }
  };

  const tabs = [
    {
      id: "discussion",
      label: "Discussions",
      icon: MessageSquare,
      count: comments.length,
    },
    { id: "upnext", label: "Up Next", icon: PlaySquare },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="flex h-[calc(100vh-64px)] sticky top-4 items-start">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isOpen ? 320 : 64,
          height: isOpen ? "100%" : "auto",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
          mass: 1,
        }}
        className="bg-white/80 backdrop-blur-3xl border border-white/60 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden"
      >
        {/* Header - Changes orientation based on isOpen */}
        <motion.div
          layout
          className={`flex ${
            isOpen
              ? "flex-col p-3 gap-3 border-b border-slate-100/50 bg-slate-50/30"
              : "flex-col items-center py-6 gap-6"
          }`}
        >
          {/* Action Buttons Group */}
          <motion.div
            layout
            className={`flex ${
              isOpen
                ? "flex-row justify-between items-center px-1"
                : "flex-col gap-6"
            }`}
          >
            {/* Like Button */}
            <motion.div layout>
              <PixelCard
                variant="blue"
                className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                gap={3}
                speed={15}
                colors="#3b82f6,#60a5fa,#93c5fd"
                onClick={onLike}
              >
                <div className="flex flex-col items-center justify-center relative z-10 text-blue-600">
                  <ThumbsUp size={16} />
                  <span className="text-[9px] font-bold mt-0.5">
                    {videoData.likes}
                  </span>
                </div>
              </PixelCard>
            </motion.div>

            {/* Dislike Button */}
            <motion.div layout>
              <PixelCard
                variant="blue"
                className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                gap={3}
                speed={15}
                colors="#f43f5e,#fb7185,#fda4af"
                onClick={onDislike}
              >
                <ThumbsDown size={16} className="text-rose-500 relative z-10" />
              </PixelCard>
            </motion.div>

            {isOpen && (
              <motion.div layout className="w-px h-6 bg-slate-200/50" />
            )}

            {/* Playlist Button */}
            <motion.div layout>
              <PixelCard
                variant="blue"
                className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                gap={3}
                speed={15}
                colors="#10b981,#34d399,#6ee7b7"
                onClick={onPlaylist}
              >
                <ListPlus
                  size={16}
                  className="text-emerald-600 relative z-10"
                />
              </PixelCard>
            </motion.div>

            {/* Twitter Button */}
            <motion.div layout>
              <PixelCard
                variant="blue"
                className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                gap={3}
                speed={15}
                colors="#0ea5e9,#38bdf8,#7dd3fc"
              >
                <Twitter size={16} className="text-sky-500 relative z-10" />
              </PixelCard>
            </motion.div>

            {isOpen && (
              <motion.div layout className="w-px h-6 bg-slate-200/50" />
            )}

            {isOpen && (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab(null);
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-100/80 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </motion.button>
            )}
          </motion.div>

          {!isOpen && (
            <motion.div layout className="w-8 h-px bg-slate-200/50" />
          )}

          {/* Toggle Buttons Group */}
          <motion.div
            layout
            className={`flex ${isOpen ? "flex-row gap-2" : "flex-col gap-6"}`}
          >
            {/* Discussion Toggle */}
            <motion.div layout className="flex-1">
              <PixelCard
                variant="blue"
                active={activeTab === "discussion" && isOpen}
                className={`rounded-full border p-0 cursor-pointer transition-all ${
                  isOpen ? "w-full h-11" : "w-10 h-10"
                } ${
                  activeTab === "discussion" && isOpen
                    ? "border-blue-500/50 shadow-lg shadow-blue-200/30"
                    : "border-slate-200/40"
                }`}
                gap={3}
                speed={15}
                colors="#6366f1,#818cf8,#a5b4fc"
                onClick={() => handleTabClick("discussion")}
              >
                <div className="relative z-10 flex items-center justify-center gap-2 h-full">
                  <MessageSquare
                    size={16}
                    className={
                      activeTab === "discussion" && isOpen
                        ? "text-blue-600"
                        : "text-indigo-600"
                    }
                  />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[11px] font-bold ${
                        activeTab === "discussion" && isOpen
                          ? "text-blue-700"
                          : "text-slate-600"
                      }`}
                    >
                      Discussions
                    </motion.span>
                  )}
                </div>
              </PixelCard>
            </motion.div>

            {/* Up Next Toggle */}
            <motion.div layout className="flex-1">
              <PixelCard
                variant="blue"
                active={activeTab === "upnext" && isOpen}
                className={`rounded-full border p-0 cursor-pointer transition-all ${
                  isOpen ? "w-full h-11" : "w-10 h-10"
                } ${
                  activeTab === "upnext" && isOpen
                    ? "border-amber-500/50 shadow-lg shadow-amber-200/30"
                    : "border-slate-200/40"
                }`}
                gap={3}
                speed={15}
                colors="#f59e0b,#fbbf24,#fcd34d"
                onClick={() => handleTabClick("upnext")}
              >
                <div className="relative z-10 flex items-center justify-center gap-2 h-full">
                  <PlaySquare
                    size={16}
                    className={
                      activeTab === "upnext" && isOpen
                        ? "text-amber-600"
                        : "text-amber-600"
                    }
                  />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[11px] font-bold ${
                        activeTab === "upnext" && isOpen
                          ? "text-amber-700"
                          : "text-slate-600"
                      }`}
                    >
                      Up Next
                    </motion.span>
                  )}
                </div>
              </PixelCard>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white/40"
            >
              {activeTab === "discussion" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex gap-3 mb-6 bg-white/60 p-4 rounded-xl border border-slate-100 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      U
                    </div>
                    <textarea
                      placeholder="Add to the conversation..."
                      className="w-full bg-transparent text-sm focus:outline-none resize-none h-16 text-slate-700 placeholder:text-slate-400"
                    />
                  </motion.div>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      variants={itemVariants}
                      className="flex gap-3 group bg-white/30 p-4 rounded-xl border border-slate-100/50 hover:bg-white/60 transition-all hover:border-slate-200 shadow-sm hover:shadow-md"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                        {comment.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            @{comment.user}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {activeTab === "upnext" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {relatedVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      variants={itemVariants}
                      className="flex gap-3 group cursor-pointer bg-white/30 p-2.5 rounded-xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all hover:border-slate-200"
                    >
                      <div className="relative w-28 aspect-video bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                          {video.views}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VideoDetailSidebar;
