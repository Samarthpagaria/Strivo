import { Heart, Edit2, Trash2, X, Check, PlaySquare, MessageCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useTweet } from "../ContentApi/TweetContext";
import { useState, useEffect } from "react";
import TweetPost from "./TweetPost";

const getRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31556952)
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31556952)}y ago`;
};

const Tweet = ({
  _id,
  content,
  ownerDetails,
  createdAt,
  likesCount = 0,
  isLiked: initialIsLiked = false,
  images = [],
  videos = [],
  videoMentionDetails = null,
  isComment = false,
  commentsCount = 0,
  isGridView = false,
}) => {
  const { user } = useGlobal();
  const { updateTweet, deleteTweet, toggleTweetLike, getTweetComments } = useTweet();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const isOwner = user?._id === ownerDetails?._id;
  const timestamp = createdAt ? getRelativeTime(createdAt) : "just now";

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    const result = await getTweetComments(_id);
    setComments(result.data || []);
    setIsLoadingComments(false);
  };

  const handleToggleComments = (e) => {
    e.stopPropagation();
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    
    // Optimistic update
    const prevIsLiked = isLiked;
    const prevLikeCount = likeCount;
    
    setIsLiked(!prevIsLiked);
    setLikeCount(prevIsLiked ? prevLikeCount - 1 : prevLikeCount + 1);

    try {
      await toggleTweetLike.mutateAsync(_id);
    } catch (error) {
      // Rollback on error
      setIsLiked(prevIsLiked);
      setLikeCount(prevLikeCount);
    }
  };

  const handleUpdate = async (e) => {
    e.stopPropagation();
    if (!editedContent.trim() || editedContent === content) {
      setIsEditing(false);
      return;
    }
    await updateTweet.mutateAsync({ tweetId: _id, content: editedContent });
    setIsEditing(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await deleteTweet.mutateAsync(_id);
  };

  return (
    <div className="relative p-2 hover:bg-muted/10 dark:hover:bg-white/5 transition-colors cursor-pointer group/card rounded-xl">
      {/* Disappearing Border (Bottom) */}
      {!isGridView && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-gray-200 dark:via-white/5 to-transparent" />
      )}
      
      <div className="flex gap-3">
        {/* Avatar */}
        <Link 
          to={`/c/${ownerDetails?.username}`}
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={ownerDetails?.avatar || "https://via.placeholder.com/150"}
            alt={ownerDetails?.username}
            className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity border border-gray-100 dark:border-white/10"
          />
        </Link>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <Link 
                to={`/c/${ownerDetails?.username}`}
                className="font-bold font-satoshi text-neutral-900 dark:text-neutral-100 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {ownerDetails?.username}
              </Link>
              <span className="text-muted-foreground dark:text-muted-foreground/60 font-satoshi font-medium text-sm">
                @{ownerDetails?.fullName} · {timestamp}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && !isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Comment Button */}
              {!isGridView && (
                <button
                  onClick={handleToggleComments}
                  className="flex items-center gap-1 group shrink-0"
                >
                  <div className="p-1.5 rounded-full transition-colors group-hover:bg-primary/10">
                    <MessageSquare
                      className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground/40 group-hover:text-primary transition-colors">
                    {commentsCount > 0 ? commentsCount : ""}
                  </span>
                </button>
              )}

              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-1 group shrink-0"
              >
                <div className="p-1.5 rounded-full transition-colors group-hover:bg-pink-100 dark:group-hover:bg-pink-500/10">
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isLiked
                        ? "text-pink-500 fill-pink-500"
                        : "text-muted-foreground/40 dark:text-muted-foreground/40 group-hover:text-pink-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isLiked
                      ? "text-pink-500"
                      : "text-muted-foreground/40 group-hover:text-pink-500"
                  }`}
                >
                  {likeCount}
                </span>
              </button>
            </div>
          </div>

          {/* Tweet Text */}
          {isEditing ? (
            <div
              className="mt-2 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                className="w-full p-3 text-sm border border-primary/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none resize-none bg-background text-foreground"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoFocus
                rows={3}
              />
              <div className="flex justify-end gap-2 text-foreground font-satoshi font-black tracking-tight mb-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(content);
                  }}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  title="Cancel"
                >
                  <X size={14} className="w-4 h-4" />
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateTweet.isPending}
                  className="p-1.5 rounded-full hover:bg-emerald-500/10 text-emerald-600 transition-colors disabled:opacity-50"
                  title="Save"
                >
                   <Check size={14} className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-1 flex-1 font-inter text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap wrap-break-word font-medium leading-relaxed text-[15px] tracking-tight">
                {content}
              </div>

              {/* Video Mention Card */}
              {videoMentionDetails && (
                <Link
                  to={`/watch/${videoMentionDetails._id}`}
                  className="mt-3 block group/mention transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border border-neutral-200 dark:border-white/5 rounded-2xl overflow-hidden bg-neutral-50 dark:bg-white/5 flex flex-col sm:flex-row max-w-lg transition-colors">
                    <div className="relative w-full sm:w-40 aspect-video shrink-0 overflow-hidden bg-muted dark:bg-black/40">
                      <img 
                        src={videoMentionDetails.thumbnail} 
                        alt={videoMentionDetails.title}
                        className="w-full h-full object-cover group-hover/mention:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex items-center flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-tight group-hover/mention:text-primary transition-colors">
                        {videoMentionDetails.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              )}
              
              {/* Media Display - Images */}
              {images?.length > 0 && (
                <div className={`mt-3 grid gap-2 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {images.map((imgUrl, i) => (
                    <img 
                      key={i} 
                      src={imgUrl} 
                      alt="Tweet attachment" 
                      className="rounded-2xl border border-gray-200 dark:border-white/5 object-cover w-full max-h-80 shadow-sm"
                    />
                  ))}
                </div>
              )}

              {/* Media Display - Videos */}
              {videos?.length > 0 && (
                <div className={`mt-3 grid gap-2 ${videos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {videos.map((vidUrl, i) => (
                    <video 
                      key={i} 
                      src={vidUrl} 
                      controls 
                      className="rounded-2xl border border-gray-200 dark:border-white/5 w-full max-h-80 bg-black shadow-sm"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-2 ml-8 space-y-0" onClick={(e) => e.stopPropagation()}>
          <div className="relative mb-2">
             <TweetPost 
                isReply={true} 
                parentTweetId={_id} 
                onPostSuccess={fetchComments} 
             />
          </div>
          
          {isLoadingComments ? (
            <div className="py-4 flex justify-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map((comment, idx) => (
                <div key={comment._id} className="relative pl-4">
                  {/* The Curved Branch Connector with Junction Dot */}
                  <div className={`absolute left-0 top-0 w-[1px] bg-neutral-300 dark:bg-white/20 shadow-[0_0_12px_rgba(255,255,255,0.05)] ${idx === comments.length - 1 ? 'h-[22px]' : 'bottom-0'}`} />
                  <div className="absolute left-0 top-4 w-5 h-5 border-l-[1.5px] border-b-[1.5px] border-neutral-300 dark:border-white/20  rounded-bl-xl shadow-[-2px_2px_10px_rgba(255,255,255,0.05)]" />
                  <div className="absolute left-[-2.25px] top-[18px] w-[6px] h-[6px] rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] z-20" />
                  
                  <Tweet 
                    {...comment} 
                    isComment={true} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tweet;
