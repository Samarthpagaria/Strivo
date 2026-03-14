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
  Trash2,
  Pencil,
} from "lucide-react";
import PixelCard from "./PixelCard";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useComment } from "../ContentApi/CommentContext";
import { usePlaylist } from "../ContentApi/PlaylistContext";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "../ContentApi/ToastContext";

const VideoDetailSidebar = ({
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
  const { user } = useGlobal();
  const [activeTab, setActiveTab] = useState(null); // null means drawer is closed
  const {
    getCommentsQuery,
    createCommentMutation,
    removeCommentMutation,
    updateCommentMutation,
    videoId,
  } = useComment();

  const {
    allPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    isAddingVideoToPlaylist,
    isRemovingVideoFromPlaylist,
  } = usePlaylist();

  const { showToast } = useToast();

  const isLoadingPlaylist =
    isAddingVideoToPlaylist || isRemovingVideoFromPlaylist;

  const handleTogglePlaylist = (playlist) => {
    if (!videoId) {
      showToast("No video ID provided");
      return;
    }
    const playlistId = playlist._id || playlist.id;
    if (isVideoInPlaylist(playlist)) {
      removeVideoFromPlaylist.mutate({ videoId, playlistId });
    } else {
      addVideoToPlaylist.mutate({ videoId, playlistId });
    }
  };

  const isVideoInPlaylist = (playlist) => {
    if (!playlist.videos || !Array.isArray(playlist.videos)) {
      return false;
    }
    return playlist.videos.some(
      (v) => v === videoId || v?._id === videoId || v?.toString() === videoId
    );
  };

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleTabClick = (tabId) => {
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setIsOpen(true);
      setActiveTab(tabId);
    }
  };

  const comments = getCommentsQuery.data || [];
  console.log(comments);
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
  const [commentText, setCommentText] = useState("");

  function handleCommentSubmit() {
    if (!commentText.trim()) return;

    createCommentMutation.mutate(
      {
        videoId,
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText(""); // Clear the input on success
        },
      }
    );
  }
  function handleCommentCancel() {
    setCommentText("");
  }

  const handleEditStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleEditSave = (commentId) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate(
      { commentId, content: editContent },
      {
        onSuccess: () => {
          handleEditCancel();
        },
      }
    );
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
                <div
                  className={`flex flex-col items-center justify-center relative z-10 ${
                    videoData.isLiked ? "text-blue-500" : "text-slate-400"
                  }`}
                >
                  <ThumbsUp
                    size={16}
                    fill={videoData.isLiked ? "currentColor" : "none"}
                  />
                  <span className="text-[9px] font-bold mt-0.5">
                    {videoData.likesCount}
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
              <Popover>
                <PopoverTrigger asChild>
                  <PixelCard
                    variant="blue"
                    className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    gap={3}
                    speed={15}
                    colors="#10b981,#34d399,#6ee7b7"
                  >
                    <ListPlus
                      size={16}
                      className="text-emerald-600 relative z-10"
                    />
                  </PixelCard>
                </PopoverTrigger>
                <PopoverContent
                  side={isOpen ? "bottom" : "left"}
                  align="center"
                  className="w-56 p-2 bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl z-200"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-2">
                      Add to Playlist
                    </p>
                    <div className="max-h-[240px] overflow-y-auto scrollbar-none space-y-0.5">
                      {allPlaylists && allPlaylists.length > 0 ? (
                        allPlaylists.map((playlist) => (
                          <button
                            key={playlist._id || playlist.id}
                            onClick={() => handleTogglePlaylist(playlist)}
                            disabled={isLoadingPlaylist}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all text-left ${
                              isLoadingPlaylist
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-slate-50 text-slate-700 hover:text-emerald-600"
                            }`}
                          >
                            <span className="truncate">{playlist?.name}</span>
                            <div
                              className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                                isVideoInPlaylist(playlist)
                                  ? "bg-emerald-500 border-emerald-500 scale-110"
                                  : "border-slate-200"
                              }`}
                            >
                              {isVideoInPlaylist(playlist) && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center bg-slate-50/50 rounded-xl">
                          <PlaySquare
                            size={24}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="text-[10px] font-bold text-slate-400 leading-tight">
                            No playlists found.<br />Create one first!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
                  className="space-y-1"
                >
                  <motion.div
                    variants={itemVariants}
                    className="relative bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200/60 p-4 shadow-sm group focus-within:shadow-lg focus-within:shadow-blue-500/5 focus-within:border-blue-500/30 transition-all duration-500 mb-8"
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 pt-1">
                        {user?.avatar ? (
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm shadow-blue-200/50">
                            {user?.fullName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <textarea
                          placeholder="Share your thoughts..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          disabled={createCommentMutation.isPending}
                          className="w-full bg-transparent text-sm focus:outline-none resize-none min-h-[44px] placeholder:text-slate-400 text-slate-700 leading-relaxed font-medium pt-2 scrollbar-none"
                        />
                        <div className="flex items-center justify-end gap-3 h-0 group-focus-within:h-10 group-focus-within:mt-2 overflow-hidden transition-all duration-500 ease-out opacity-0 group-focus-within:opacity-100">
                          <button
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100/80 transition-all active:scale-95"
                            onClick={handleCommentCancel}
                            disabled={createCommentMutation.isPending}
                          >
                            Cancel
                          </button>
                          <button
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-black/10 active:scale-95 flex items-center gap-2 ${
                              createCommentMutation.isPending
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5"
                            }`}
                            onClick={handleCommentSubmit}
                            disabled={
                              createCommentMutation.isPending ||
                              !commentText.trim()
                            }
                          >
                            {createCommentMutation.isPending
                              ? "Posting..."
                              : "Comment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      variants={itemVariants}
                      className="flex gap-3 group px-2 py-3 rounded-xl hover:bg-slate-50/50 transition-all duration-300 relative"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100 overflow-hidden">
                        {comment.owner?.avatar ? (
                          <img
                            src={comment.owner.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center h-full font-bold text-indigo-600 text-xs">
                            {comment.owner?.username?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              @{comment.owner?.username}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {comment.createdAt
                                ? formatDistanceToNow(new Date(comment.createdAt)) + " ago"
                                : ""}
                            </span>
                          </div>
                          
                          {/* Action Buttons - Only for owner */}
                          {user?._id === comment.owner?._id && !editingCommentId && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditStart(comment)}
                                className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all active:scale-90"
                                title="Edit comment"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                onClick={() => removeCommentMutation.mutate({ commentId: comment._id })}
                                disabled={removeCommentMutation.isPending}
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all active:scale-90 disabled:opacity-50"
                                title="Delete comment"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {editingCommentId === comment._id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500/50 min-h-[60px] resize-none"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={handleEditCancel}
                                className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditSave(comment._id)}
                                disabled={updateCommentMutation.isPending || !editContent.trim()}
                                className="px-4 py-1 text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                              >
                                {updateCommentMutation.isPending ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-600 leading-relaxed wrap-break-word">
                            {comment.content}
                          </p>
                        )}
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
