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
  const isLiked = likedVideosQuery.data?.data?.videos?.some(v => v._id === _id);

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      className="w-full hover:opacity-75 hover:bg-gray-200 rounded-3xl transition-all duration-300 p-2 cursor-pointer group"
    >
      <div className="bg-gray-200 w-full aspect-video rounded-xl overflow-hidden ">
        <img
          src={videoThumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-3 mt-3">
        <img
          onClick={handleProfileClick}
          src={channelAvatar}
          alt={channelName}
          className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
          title={channelName}
        />
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
          <p
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
            onClick={handleProfileClick}
          >
            {channelName}
          </p>
          <p className="text-xs text-gray-500">
            {viewCount} views · {uploadedTime}
          </p>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleLikeClick}
            disabled={toggleLikeMutation.isPending}
            className={`p-1.5 rounded-full hover:bg-gray-300 transition-colors ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <VideoCardMenu videoId={_id} />
        </div>
      </div>
    </div>
  );
};


export default VideoCard;
