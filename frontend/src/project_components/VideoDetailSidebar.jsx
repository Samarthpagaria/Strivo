import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Ellipsis,
  AtSign,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useComment } from "../ContentApi/CommentContext";
import { usePlaylist } from "../ContentApi/PlaylistContext";
import { useToast } from "../ContentApi/ToastContext";
import { useTweet } from "../ContentApi/TweetContext";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div
    className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}
  >
    <div className="absolute w-full h-[1px] bg-border" />
    <div className="absolute h-full w-[1px] bg-border" />
  </div>
);

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
  const { setPrefillTweet } = useTweet();
  const navigate = useNavigate();

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
  const [isTweeting, setIsTweeting] = useState(false);

  const isLoadingPlaylist =
    isAddingVideoToPlaylist || isRemovingVideoFromPlaylist;
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
    return vids.some(
      (v) => v === videoId || v?._id === videoId || v?.toString() === videoId,
    );
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
    createCommentMutation.mutate(
      { videoId, content: commentText },
      {
        onSuccess: () => setCommentText(""),
      },
    );
  };

  const handleEditSave = (commentId) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate(
      { commentId, content: editContent },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
        },
      },
    );
  };

  const handleConfirmDelete = (commentId) => {
    removeCommentMutation.mutate(
      { commentId },
      {
        onSuccess: () => {
          setDeletingCommentId(null);
        },
      },
    );
  };

  const handleShareToTwitter = () => {
    if (!videoId) return;

    setPrefillTweet({
      content: `Check out this awesome video: ${videoData?.title}!`,
      videoMention: videoId,
    });

    showToast("Video pinned to your next post!", "success");
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="flex h-[calc(100vh-64px)] sticky top-4 items-start font-inter">
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? "min(360px, calc(100vw - 32px))" : 72,
          height: isOpen ? "80vh" : "auto",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
        className="bg-background/5 border border-border backdrop-blur-xl flex flex-col overflow-hidden shadow-lg rounded-2xl relative"
      >
        {/* Navigation / Header */}
        <div
          className={`flex ${isOpen ? "flex-col p-4 border-b border-border bg-muted/20" : "flex-col items-center py-6 gap-6"}`}
        >
          <div
            className={`flex ${isOpen ? "flex-row justify-between items-center" : "flex-col gap-6"}`}
          >
            {/* Quick Actions */}
            <div
              className={`flex ${isOpen ? "flex-row items-center gap-2" : "flex-col items-center gap-6"}`}
            >
              <Button
                onClick={onLike}
                variant="outline"
                className={`transition-all duration-300 relative overflow-hidden group font-inter rounded-full ${isOpen ? "h-9 py-0 pe-0 ps-2.5 border-border/50 bg-background/50 hover:bg-muted/50" : "w-10 h-12 flex-col p-1 border-border/50 bg-background/50"} ${videoData?.isLiked ? "border-rose-500/50 bg-rose-500/10 text-rose-500" : "text-foreground/80"}`}
                title="Like Video"
              >
                <div
                  className={`flex items-center ${isOpen ? "gap-2" : "flex-col justify-center gap-1"}`}
                >
                  <ThumbsUp
                    size={isOpen ? 15 : 18}
                    strokeWidth={2.5}
                    fill={videoData?.isLiked ? "currentColor" : "none"}
                    className={isOpen ? "opacity-90" : ""}
                  />
                  {!isOpen && (
                    <span className="text-[10px] font-bold font-inter">
                      {videoData?.likesCount || 0}
                    </span>
                  )}
                </div>

                {isOpen && (
                  <span className="relative ms-3 inline-flex h-full items-center justify-center px-3 text-[11px] font-bold text-muted-foreground/60 before:absolute before:inset-0 before:left-0 before:w-px before:bg-border/50 font-inter">
                    {videoData?.likesCount || 0}
                  </span>
                )}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-9 h-9 border border-border/50 rounded-full flex items-center justify-center cursor-pointer hover:border-border hover:bg-muted/50 transition-all text-foreground/80"
                    title="Add to Playlist"
                  >
                    <ListPlus size={18} strokeWidth={2} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side={isOpen ? "bottom" : "left"}
                  className="w-64 p-0 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-xl font-inter overflow-hidden"
                >
                  <div className="border-b border-border bg-muted/30 px-3 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Add to Playlist
                    </p>
                  </div>
                  <div className="max-h-[240px] overflow-y-auto scrollbar-none">
                    {allPlaylists?.length > 0 ? (
                      <div className="grid grid-cols-1 border-t border-border relative">
                        {allPlaylists.map((playlist) => (
                          <button
                            key={playlist._id}
                            onClick={() => handleTogglePlaylist(playlist)}
                            disabled={isLoadingPlaylist}
                            className={`w-full flex items-center justify-between p-3 text-xs font-bold transition-all border-b border-border/50 last:border-b-0 ${isLoadingPlaylist ? "opacity-50" : "hover:bg-muted/50 text-foreground"}`}
                          >
                            <span className="truncate">{playlist?.name}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isVideoInPlaylist(playlist) ? "bg-primary border-primary" : "border-border"}`}
                            >
                              {isVideoInPlaylist(playlist) && (
                                <div className="w-1.5 h-1.5 bg-background rounded-full" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-8 text-center">
                        <PlaySquare
                          size={20}
                          className="mx-auto mb-2 text-gray-300"
                        />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          No playlists
                        </p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <button
                onClick={handleShareToTwitter}
                title="Share to Tweets"
                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative border-none bg-gradient-to-tr from-orange-500 via-rose-500 to-emerald-500 animate-gradient-shift shadow-sm hover:animate-glow-pulse hover:ring-2 hover:ring-white/40 hover:scale-110 hover:brightness-125 ${isTweeting ? "opacity-50" : ""}`}
              >
                <AtSign
                  size={16}
                  strokeWidth={2.5}
                  className="text-white drop-shadow-md"
                />
              </button>
            </div>

            {isOpen && <div className="w-px h-6 bg-border mx-2" />}
            {isOpen && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab(null);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted bg-muted/50 transition-all text-foreground/70 hover:text-foreground border border-border/50"
              >
                <X size={18} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Tab Toggles */}
          {!isOpen && <div className="w-6 h-px bg-border" />}
          <div
            className={`flex ${isOpen ? "flex-row gap-2 mt-4" : "flex-col gap-6"}`}
          >
            <button
              className={`p-0 cursor-pointer transition-all flex items-center justify-center border rounded-full ${isOpen ? "flex-1 h-9" : "w-10 h-9"} ${activeTab === "discussion" && isOpen ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/50 backdrop-blur-sm hover:bg-muted text-muted-foreground"}`}
              onClick={() => handleTabClick("discussion")}
            >
              <div className="flex items-center justify-center gap-2 h-full">
                <MessageSquare
                  size={16}
                  strokeWidth={2}
                  className={
                    activeTab === "discussion" && isOpen
                      ? "text-primary-foreground"
                      : "text-foreground/80"
                  }
                />
                {isOpen && (
                  <span
                    className={`text-xs font-bold font-satoshi ${activeTab === "discussion" && isOpen ? "text-primary-foreground" : "text-foreground/70"}`}
                  >
                    Comments
                  </span>
                )}
              </div>
            </button>

            <button
              className={`p-0 cursor-pointer transition-all flex items-center justify-center border rounded-full ${isOpen ? "flex-1 h-9" : "w-10 h-9"} ${activeTab === "upnext" && isOpen ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/50 backdrop-blur-sm hover:bg-muted text-muted-foreground"}`}
              onClick={() => handleTabClick("upnext")}
            >
              <div className="flex items-center justify-center gap-2 h-full">
                <PlaySquare
                  size={16}
                  strokeWidth={2}
                  className={
                    activeTab === "upnext" && isOpen
                      ? "text-primary-foreground"
                      : "text-foreground/80"
                  }
                />
                {isOpen && (
                  <span
                    className={`text-xs font-bold font-satoshi ${activeTab === "upnext" && isOpen ? "text-primary-foreground" : "text-foreground/70"}`}
                  >
                    Up Next
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 overflow-y-auto custom-scrollbar bg-transparent"
            >
              {activeTab === "discussion" && (
                <div className="flex flex-col">
                  {/* Create Comment Form - Tweet Style */}
                  <div className="border-b border-border bg-muted/10 p-4 transition-all">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            className="w-10 h-10 object-cover rounded-full border border-border shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-full font-bold text-sm border border-border shadow-sm">
                            {user?.fullName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <textarea
                          placeholder="Share your thoughts..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          disabled={createCommentMutation.isPending}
                          className="w-full bg-transparent text-sm focus:outline-none resize-none min-h-[44px] placeholder:text-muted-foreground/50 text-foreground font-medium py-1"
                        />
                        <div className="flex items-center justify-end gap-3 transition-opacity">
                          {commentText.trim() && (
                            <button
                              onClick={() => setCommentText("")}
                              className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={handleCommentSubmit}
                            disabled={
                              createCommentMutation.isPending ||
                              !commentText.trim()
                            }
                            className={`px-5 py-2 text-xs font-satoshi font-bold  rounded-full transition-all font-inter ${createCommentMutation.isPending ? "bg-muted text-muted-foreground" : !commentText.trim() ? "bg-muted/50 text-muted-foreground/30" : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"}`}
                          >
                            {createCommentMutation.isPending
                              ? "Posting"
                              : "Reply"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment List - Tweet Style */}
                  <div className="flex flex-col">
                    {comments.length === 0 ? (
                      <div className="py-12 text-center text-sm font-medium text-gray-400">
                        Be the first to share your thoughts.
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <motion.div
                          key={comment._id}
                          initial="hidden"
                          animate="show"
                          variants={itemVariants}
                          className="flex gap-3 px-4 py-4 border-b border-border bg-background/5 group hover:bg-muted/40 transition-all duration-300"
                        >
                          <div className="w-10 h-10 bg-muted text-muted-foreground flex items-center justify-center font-bold shrink-0 border border-border rounded-full overflow-hidden shadow-sm">
                            {comment.owner?.avatar ? (
                              <img
                                src={comment.owner.avatar}
                                alt=""
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                            ) : (
                              <span className="text-xs">
                                {comment.owner?.username?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-foreground text-sm truncate hover:underline cursor-pointer">
                                  {comment.owner?.fullName ||
                                    comment.owner?.username}
                                </span>
                                <span className="font-medium text-muted-foreground text-[11px] truncate">
                                  @{comment.owner?.username}
                                </span>
                                <span className="text-muted-foreground/30 text-[10px]">
                                  ·
                                </span>
                                <span className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer font-bold">
                                  {comment.createdAt &&
                                    formatDistanceToNow(
                                      new Date(comment.createdAt),
                                      { addSuffix: false },
                                    )}
                                </span>
                              </div>

                              {user?._id === comment.owner?._id &&
                                !editingCommentId && (
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {deletingCommentId === comment._id ? (
                                      <div className="flex items-center gap-2 bg-red-50 px-2 py-0.5 border border-red-100 text-[10px]">
                                        <span className="font-bold text-red-600">
                                          Delete?
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleConfirmDelete(comment._id)
                                          }
                                          className="font-black text-red-700 hover:underline"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() =>
                                            setDeletingCommentId(null)
                                          }
                                          className="font-black text-gray-500 hover:underline"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(comment._id);
                                            setEditContent(comment.content);
                                          }}
                                          className="text-gray-400 hover:text-blue-600 transition-colors"
                                          title="Edit comment"
                                        >
                                          <Pencil size={12} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            setDeletingCommentId(comment._id)
                                          }
                                          className="text-gray-400 hover:text-red-600 transition-colors"
                                          title="Delete comment"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                            </div>

                            {editingCommentId === comment._id ? (
                              <div className="mt-2 space-y-2 pr-4">
                                <textarea
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  }
                                  className="w-full bg-muted/30 border border-border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-lg min-h-[60px] text-foreground"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleEditSave(comment._id)}
                                    disabled={
                                      updateCommentMutation.isPending ||
                                      !editContent.trim()
                                    }
                                    className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary hover:opacity-90 text-primary-foreground transition-all rounded-lg disabled:opacity-50"
                                  >
                                    {updateCommentMutation.isPending
                                      ? "Saving..."
                                      : "Save"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-foreground/90 leading-relaxed wrap-break-word font-inter pr-4">
                                  {comment.content}
                                </p>
                                <div className="mt-3 flex items-center gap-6">
                                  <button
                                    onClick={() => {
                                      const isLiked =
                                        likedComments[comment._id] ??
                                        comment.isLiked;
                                      setLikedComments((prev) => ({
                                        ...prev,
                                        [comment._id]: !isLiked,
                                      }));
                                      likeCommentMutation.mutate({
                                        commentId: comment._id,
                                      });
                                    }}
                                    className={`flex items-center gap-1.5 transition-all text-xs font-semibold group/like ${(likedComments[comment._id] ?? comment.isLiked) ? "text-rose-600" : "text-gray-500 hover:text-rose-600"}`}
                                  >
                                    <div
                                      className={`p-1.5 rounded-full transition-colors ${(likedComments[comment._id] ?? comment.isLiked) ? "bg-rose-50" : "group-hover/like:bg-rose-50"}`}
                                    >
                                      <ThumbsUp
                                        size={14}
                                        fill={
                                          (likedComments[comment._id] ??
                                          comment.isLiked)
                                            ? "currentColor"
                                            : "none"
                                        }
                                      />
                                    </div>
                                    <span className="tabular-nums mt-0.5">
                                      {(comment.likesCount || 0) +
                                        (likedComments[comment._id] === true &&
                                        !comment.isLiked
                                          ? 1
                                          : likedComments[comment._id] ===
                                                false && comment.isLiked
                                            ? -1
                                            : 0)}
                                    </span>
                                  </button>
                                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary group/reply transition-all">
                                    <div className="p-1.5 rounded-full group-hover/reply:bg-primary/10 transition-colors text-foreground/50 group-hover/reply:text-primary">
                                      <MessageSquare size={14} />
                                    </div>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "upnext" && (
                <div className="w-full relative bg-transparent">
                  {isLoadingRelated ? (
                    <div className="flex flex-col border-t border-l border-border mt-4 mx-4 relative overflow-hidden">
                      <Crosshair className="-top-1.5 -left-1.5 z-10" />
                      <Crosshair className="-top-1.5 -right-1.5 z-10" />

                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex gap-3 animate-pulse border-r border-b border-border p-3 bg-muted/10"
                        >
                          <div className="w-28 aspect-video bg-muted shrink-0 border border-border rounded-lg" />
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-muted rounded-full w-3/4" />
                            <div className="h-2 bg-muted rounded-full w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : relatedVideos.length === 0 ? (
                    <div className="px-4 py-16 text-center border-t border-l border-border mt-4 mx-4 relative bg-muted/5 rounded-xl">
                      <Crosshair className="-top-1.5 -left-1.5" />
                      <Crosshair className="-top-1.5 -right-1.5" />
                      <Crosshair className="-bottom-1.5 -left-1.5" />
                      <Crosshair className="-bottom-1.5 -right-1.5" />
                      <div className="border border-border/50 w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-muted/20 rounded-full">
                        <PlaySquare
                          size={20}
                          className="text-muted-foreground/30"
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        No related videos
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col px-4 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-muted-foreground/60 flex items-center gap-2">
                          <div className="w-1 h-3 bg-primary rounded-full" />
                          Up Next
                        </h3>
                        <span className="text-[9px] font-bold text-muted-foreground/30 px-2 py-0.5 border border-border/40 rounded-full">
                          {relatedVideos.length} Videos
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {relatedVideos.map((video) => (
                          <Link
                            key={video._id}
                            to={`/watch/${video._id}`}
                            className="relative py-2.5 flex gap-4 group hover:bg-muted/15 transition-all duration-300 rounded-lg -mx-2 px-2"
                          >
                            <div className="relative w-32 aspect-video bg-muted shrink-0 rounded-md overflow-hidden">
                              <img
                                src={video.thumbnail}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <Play
                                  size={18}
                                  fill="white"
                                  className="text-white drop-shadow-sm scale-90 group-hover:scale-100 transition-transform"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-start py-0.5">
                              <h4 className="font-bold font-satoshi text-foreground text-[12px] line-clamp-2 leading-[1.3] group-hover:text-primary transition-colors">
                                {video.title}
                              </h4>
                              <div className="flex flex-col gap-1 mt-auto">
                                <p className="text-[10px] text-muted-foreground font-black truncate group-hover:text-foreground transition-colors font-inter">
                                  {video.owner?.fullName}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 font-bold font-inter">
                                  <span className="tabular-nums">
                                    {video.views} views
                                  </span>
                                  <span className="opacity-30">•</span>
                                  <span>
                                    {video.createdAt &&
                                      formatDistanceToNow(
                                        new Date(video.createdAt),
                                        { addSuffix: false },
                                      )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
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
