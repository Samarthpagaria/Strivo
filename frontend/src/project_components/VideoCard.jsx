import React, { useState, useEffect } from "react";
import { MoreVertical, Heart } from "lucide-react";
import VideoCardMenu from "./VideoCardMenu";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useToast } from "../ContentApi/ToastContext";
import { useVideo } from "../ContentApi/VideoContext";

// Helper function to format relative time
const getRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31556952)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31556952)} years ago`;
};

const VideoCard = ({ _id, title, owner, views, createdAt, thumbnail }) => {
  const navigate = useNavigate();
  const { token, user } = useGlobal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { likedVideosQuery } = useVideo();

  // Check if this video is in the user's liked videos
  const isLiked = likedVideosQuery.data?.data?.videos?.some(
    (v) => v._id === _id,
  );

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["likedVideos", user?.username]);
      showToast(data.message);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || "Failed to toggle like");
    },
  });

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!token) {
      showToast("Please login to like videos");
      return;
    }
    toggleLikeMutation.mutate();
  };

  // Handle both API data (owner object) and mock data (channel string)
  const channelName = owner?.username || owner?.fullName || "Unknown Channel";
  const channelAvatar =
    owner?.avatar || "https://picsum.photos/id/10/10/300?grayscale&blur=2";
  const videoThumbnail = thumbnail || "https://picsum.photos/600/400.jpg";
  const uploadedTime = createdAt ? getRelativeTime(createdAt) : "Unknown";
  const viewCount = views || 0;

  const handleCardClick = () => {
    navigate(`/watch/${_id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (owner?.username) {
      navigate(`/c/${owner.username}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full transition-all duration-300 cursor-pointer group"
    >
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
        <img
          src={videoThumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex gap-3 mt-4">
        <img
          onClick={handleProfileClick}
          src={channelAvatar}
          alt={channelName}
          className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
          title={channelName}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-[15px] font-bold font-satoshi line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p
            className="text-xs font-medium font-satoshi text-muted-foreground hover:text-foreground transition-colors mt-1"
            onClick={handleProfileClick}
          >
            {channelName}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
             <p className="text-[11px] font-medium font-inter text-muted-foreground/60">
              {viewCount} views
            </p>
            <span className="text-muted-foreground/30 text-[10px]">·</span>
            <p className="text-[11px] font-medium font-inter text-muted-foreground/60">
              {uploadedTime}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 self-start"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleLikeClick}
            disabled={toggleLikeMutation.isPending}
            className={`p-2 rounded-full transition-all ${
              isLiked ? "text-rose-600 bg-rose-50" : "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
            }`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <VideoCardMenu videoId={_id} />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
