import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  PlaySquare,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  X,
  ListPlus,
  Twitter,
  Trash2,
  Pencil,
} from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import PixelCard from "./PixelCard";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useComment } from "../ContentApi/CommentContext";
import { usePlaylist } from "../ContentApi/PlaylistContext";
import { useToast } from "../ContentApi/ToastContext";

const VideoDetailSidebar = ({
  relatedVideos = [],
  isOpen,
  setIsOpen,
  videoData,
  onLike,
  isLoadingRelated,
}) => {
  const { user } = useGlobal();
  const { showToast } = useToast();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState("discussion");
  
  // Comment Logic Hook
  const {
    getCommentsQuery,
    createCommentMutation,
    removeCommentMutation,
    updateCommentMutation,
    videoId,
    likeCommentMutation,
  } = useComment();

  // Playlist Logic Hook
  const {
    allPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    isAddingVideoToPlaylist,
    isRemovingVideoFromPlaylist,
  } = usePlaylist();

  // Local UI State
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [likedComments, setLikedComments] = useState({});
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const isLoadingPlaylist = isAddingVideoToPlaylist || isRemovingVideoFromPlaylist;
  const comments = getCommentsQuery.data || [];

  // Handlers
  const handleTabClick = (tabId) => {
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setIsOpen(true);
      setActiveTab(tabId);
    }
  };

  const isVideoInPlaylist = (playlist) => {
    const vids = playlist.videos || [];
    return vids.some(v => v === videoId || v?._id === videoId || v?.toString() === videoId);
  };

  const handleTogglePlaylist = (playlist) => {
    if (!videoId) return showToast("No video ID provided");
    const playlistId = playlist._id || playlist.id;
    isVideoInPlaylist(playlist) 
      ? removeVideoFromPlaylist.mutate({ videoId, playlistId })
      : addVideoToPlaylist.mutate({ videoId, playlistId });
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    createCommentMutation.mutate({ videoId, content: commentText }, {
      onSuccess: () => setCommentText("")
    });
  };

  const handleEditSave = (commentId) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editContent }, {
      onSuccess: () => {
        setEditingCommentId(null);
        setEditContent("");
      }
    });
  };

  const handleConfirmDelete = (commentId) => {
    removeCommentMutation.mutate({ commentId }, {
      onSuccess: () => {
        setDeletingCommentId(null);
      }
    });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] sticky top-4 items-start">
      <motion.div
        layout
        initial={false}
        animate={{ width: isOpen ? 320 : 64, height: isOpen ? "100%" : "auto" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="bg-white/80 backdrop-blur-3xl border border-white/60 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden"
      >
        {/* Navigation / Header */}
        <motion.div layout className={`flex ${isOpen ? "flex-col p-3 gap-3 border-b border-slate-100/50 bg-slate-50/30" : "flex-col items-center py-6 gap-6"}`}>
          <motion.div layout className={`flex ${isOpen ? "flex-row justify-between items-center px-1" : "flex-col gap-6"}`}>
            
            {/* Quick Actions */}
            <PixelCard 
              variant="blue" 
              className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
              gap={3}
              speed={15}
              colors="#3b82f6,#60a5fa,#93c5fd"
              onClick={onLike}
            >
              <div className={`flex flex-col items-center justify-center relative z-10 ${videoData.isLiked ? "text-blue-500" : "text-slate-400"}`}>
                <ThumbsUp size={16} fill={videoData.isLiked ? "currentColor" : "none"} />
                <span className="text-[9px] font-bold mt-0.5">{videoData.likesCount}</span>
              </div>
            </PixelCard>

            {isOpen && <div className="w-px h-6 bg-slate-200/50" />}

            <Popover>
              <PopoverTrigger asChild>
                <PixelCard 
                  variant="blue" 
                  className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer shadow-sm"
                  gap={3}
                  speed={15}
                  colors="#10b981,#34d399,#6ee7b7"
                >
                  <ListPlus size={16} className="text-emerald-600 relative z-10" />
                </PixelCard>
              </PopoverTrigger>
              <PopoverContent side={isOpen ? "bottom" : "left"} className="w-56 p-2 bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl z-200">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-2">Add to Playlist</p>
                  <div className="max-h-[240px] overflow-y-auto scrollbar-none space-y-0.5">
                    {allPlaylists?.length > 0 ? allPlaylists.map(playlist => (
                      <button
                        key={playlist._id} onClick={() => handleTogglePlaylist(playlist)}
                        disabled={isLoadingPlaylist}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${isLoadingPlaylist ? "opacity-50" : "hover:bg-slate-50 text-slate-700 hover:text-emerald-600"}`}
                      >
                        <span className="truncate">{playlist?.name}</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isVideoInPlaylist(playlist) ? "bg-emerald-500 border-emerald-500" : "border-slate-200"}`}>
                          {isVideoInPlaylist(playlist) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    )) : (
                      <div className="px-3 py-8 text-center bg-slate-50/50 rounded-xl">
                        <PlaySquare size={24} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-[10px] font-bold text-slate-400">No playlists found</p>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <PixelCard 
              variant="blue" 
              className="w-10 h-10 rounded-full border border-slate-200/40 p-0 cursor-pointer"
              gap={3}
              speed={15}
              colors="#0ea5e9,#38bdf8,#7dd3fc"
            >
              <Twitter size={16} className="text-sky-500 relative z-10" />
            </PixelCard>

            {isOpen && <div className="w-px h-6 bg-slate-200/50" />}
            {isOpen && (
              <button onClick={() => { setIsOpen(false); setActiveTab(null); }} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            )}
          </motion.div>

          {/* Tab Toggles */}
          {!isOpen && <div className="w-8 h-px bg-slate-200/50" />}
          <div className={`flex ${isOpen ? "flex-row gap-2" : "flex-col gap-6"}`}>
            <PixelCard
              variant="blue"
              active={activeTab === "discussion" && isOpen}
              className={`rounded-full border p-0 cursor-pointer transition-all ${isOpen ? "w-full h-11" : "w-10 h-10"} ${activeTab === "discussion" && isOpen ? "border-blue-500/50 shadow-lg shadow-blue-200/30" : "border-slate-200/40"}`}
              gap={3}
              speed={15}
              colors="#6366f1,#818cf8,#a5b4fc"
              onClick={() => handleTabClick("discussion")}
            >
              <div className="relative z-10 flex items-center justify-center gap-2 h-full">
                <MessageSquare size={16} className={activeTab === "discussion" && isOpen ? "text-blue-600" : "text-indigo-600"} />
                {isOpen && <span className={`text-[11px] font-bold ${activeTab === "discussion" && isOpen ? "text-blue-700" : "text-slate-600"}`}>Discussions</span>}
              </div>
            </PixelCard>

            <PixelCard
              variant="blue"
              active={activeTab === "upnext" && isOpen}
              className={`rounded-full border p-0 cursor-pointer transition-all ${isOpen ? "w-full h-11" : "w-10 h-10"} ${activeTab === "upnext" && isOpen ? "border-amber-500/50 shadow-lg shadow-amber-200/30" : "border-slate-200/40"}`}
              gap={3}
              speed={15}
              colors="#f59e0b,#fbbf24,#fcd34d"
              onClick={() => handleTabClick("upnext")}
            >
              <div className="relative z-10 flex items-center justify-center gap-2 h-full">
                <PlaySquare size={16} className="text-amber-600" />
                {isOpen && <span className={`text-[11px] font-bold ${activeTab === "upnext" && isOpen ? "text-amber-700" : "text-slate-600"}`}>Up Next</span>}
              </div>
            </PixelCard>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white/40"
            >
              {activeTab === "discussion" && (
                <div className="space-y-1">
                  {/* Create Comment */}
                  <div className="relative bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200/60 p-4 shadow-sm group focus-within:shadow-lg focus-within:border-blue-500/30 transition-all duration-500 mb-8">
                    <div className="flex gap-4">
                      <div className="shrink-0 pt-1">
                        {user?.avatar ? (
                          <div className="relative">
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white">{user?.fullName?.charAt(0)}</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <textarea
                          placeholder="Share your thoughts..." value={commentText} onChange={(e) => setCommentText(e.target.value)}
                          disabled={createCommentMutation.isPending} className="w-full bg-transparent text-sm focus:outline-none resize-none min-h-[44px] placeholder:text-slate-400 text-slate-700 font-medium"
                        />
                        <div className="flex items-center justify-end gap-3 h-0 group-focus-within:h-10 overflow-hidden transition-all opacity-0 group-focus-within:opacity-100">
                          <button onClick={() => setCommentText("")} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                          <button
                            onClick={handleCommentSubmit} disabled={createCommentMutation.isPending || !commentText.trim()}
                            className={`px-6 py-2 rounded-xl text-xs font-black shadow-lg ${createCommentMutation.isPending ? "bg-slate-400" : "bg-slate-900 text-white hover:bg-black"}`}
                          >
                            {createCommentMutation.isPending ? "Posting..." : "Comment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment List */}
                  {comments.map(comment => (
                    <motion.div key={comment._id} variants={itemVariants} className="flex gap-3 group px-2 py-3 rounded-xl hover:bg-slate-50 transition-all">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100 overflow-hidden">
                        {comment.owner?.avatar ? <img src={comment.owner.avatar} alt="" className="w-full h-full object-cover" /> : <span>{comment.owner?.username?.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs truncate">@{comment.owner?.username}</span>
                            <span className="text-[10px] text-slate-400">{comment.createdAt && formatDistanceToNow(new Date(comment.createdAt)) + " ago"}</span>
                          </div>
                          {user?._id === comment.owner?._id && !editingCommentId && (
                            <div className="flex items-center gap-1">
                              {deletingCommentId === comment._id ? (
                                <div className="flex items-center gap-1 mr-2 px-2 py-1 bg-red-50 rounded-lg animate-in fade-in slide-in-from-right-2 duration-300">
                                  <span className="text-[9px] font-bold text-red-600">Delete?</span>
                                  <button onClick={() => handleConfirmDelete(comment._id)} className="text-[9px] font-black text-red-700 hover:underline">Yes</button>
                                  <button onClick={() => setDeletingCommentId(null)} className="text-[9px] font-black text-slate-400 hover:underline">No</button>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => { setEditingCommentId(comment._id); setEditContent(comment.content); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors" title="Edit comment"><Pencil size={11} /></button>
                                  <button onClick={() => setDeletingCommentId(comment._id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors" title="Delete comment"><Trash2 size={12} /></button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {editingCommentId === comment._id ? (
                          <div className="mt-2 space-y-2">
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 min-h-[60px]" autoFocus />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
                              <button onClick={() => handleEditSave(comment._id)} disabled={updateCommentMutation.isPending || !editContent.trim()} className="px-4 py-1 text-[10px] bg-blue-600 text-white rounded-md">{updateCommentMutation.isPending ? "Saving..." : "Save"}</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-slate-600 leading-relaxed wrap-break-word">{comment.content}</p>
                            <div className="mt-2.5 flex items-center gap-4">
                              <button
                                onClick={() => {
                                  const isLiked = likedComments[comment._id] ?? comment.isLiked;
                                  setLikedComments(prev => ({ ...prev, [comment._id]: !isLiked }));
                                  likeCommentMutation.mutate({ commentId: comment._id });
                                }}
                                className={`flex items-center gap-1.5 transition-all ${(likedComments[comment._id] ?? comment.isLiked) ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                              >
                                <ThumbsUp size={12} fill={(likedComments[comment._id] ?? comment.isLiked) ? "currentColor" : "none"} />
                                <span className="text-[10px] font-black tabular-nums">
                                  {(comment.likesCount || 0) + (likedComments[comment._id] === true && !comment.isLiked ? 1 : likedComments[comment._id] === false && comment.isLiked ? -1 : 0)}
                                </span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "upnext" && (
                <div className="space-y-3">
                  {isLoadingRelated ? (
                    <div className="flex flex-col gap-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-28 aspect-video bg-slate-200 rounded-lg shrink-0" />
                          <div className="flex-1 space-y-2 py-1"><div className="h-3 bg-slate-200 rounded-full w-3/4" /><div className="h-2 bg-slate-200 rounded-full w-1/2" /></div>
                        </div>
                      ))}
                    </div>
                  ) : relatedVideos.length === 0 ? (
                    <div className="px-3 py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <PlaySquare size={32} className="mx-auto mb-3 text-slate-300" />
                      <p className="text-sm font-bold text-slate-400">No related videos found</p>
                    </div>
                  ) : (
                    relatedVideos.map(video => (
                      <Link key={video._id} to={`/watch/${video._id}`} className="flex gap-3 group bg-white/30 p-2.5 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        <div className="relative w-28 aspect-video bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          <img src={video.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-bold text-slate-800 text-[11px] line-clamp-2 leading-tight group-hover:text-blue-700">{video.title}</h4>
                          <div className="flex flex-col gap-0.5 mt-1.5">
                            <p className="text-[10px] text-slate-500 font-bold truncate">{video.owner?.fullName}</p>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
                              <span>{video.views} views</span><span>•</span><span>{video.createdAt && formatDistanceToNow(new Date(video.createdAt)) + " ago"}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VideoDetailSidebar;
