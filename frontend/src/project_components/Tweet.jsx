import { Heart, Edit2, Trash2, X, Check } from "lucide-react";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useTweet } from "../ContentApi/TweetContext";
import { useState } from "react";

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
}) => {
  const { user } = useGlobal();
  const { updateTweet, deleteTweet } = useTweet();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const isOwner = user?._id === ownerDetails?._id;
  const timestamp = createdAt ? getRelativeTime(createdAt) : "just now";

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
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
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer group/card">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={ownerDetails?.avatar || "https://via.placeholder.com/150"}
            alt={ownerDetails?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-semibold text-gray-900 hover:underline">
                {ownerDetails?.username}
              </span>
              <span className="text-gray-500 text-sm">
                {ownerDetails?.fullName} · {timestamp}
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
                    className="p-1.5 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-1 group shrink-0"
              >
                <div className="p-1.5 rounded-full transition-colors group-hover:bg-pink-100">
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isLiked
                        ? "text-pink-500 fill-pink-500"
                        : "text-gray-400 group-hover:text-pink-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isLiked
                      ? "text-pink-500"
                      : "text-gray-400 group-hover:text-pink-500"
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
                className="w-full p-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-white"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoFocus
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(content);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateTweet.isPending}
                  className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors disabled:opacity-50"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-1 text-gray-900 whitespace-pre-wrap break-words leading-relaxed text-sm">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweet;
