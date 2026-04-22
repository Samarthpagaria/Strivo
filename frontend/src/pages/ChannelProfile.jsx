import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfile } from "../ContentApi/ProfileContext";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoProvider } from "../ContentApi/VideoContext";
import { useGlobal } from "../ContentApi/GlobalContext";
import VideosTab from "./VideosTab";
import SubscribeButton from "../project_components/SubscribeButton";
import PlaylistsTab from "./PlaylistsTab";

const ChannelProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useGlobal();
  const { userProfile, isLoading, isError } = useProfile();
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    if (user && username && user.username === username) {
      navigate("/channel", { replace: true });
    }
  }, [user, username, navigate]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">User not found</h2>
        <p className="text-gray-500">
          The channel you are looking for does not exist.
        </p>
      </div>
    );
  }

  // Derived data mapping directly from backend response
  const channelData = {
    _id: userProfile?._id || null,
    coverImage:
      userProfile?.coverImage || "https://picsum.photos/seed/cover/1200/300",
    avatar: userProfile?.avatar || "https://picsum.photos/seed/avatar/200/200",
    fullName: userProfile?.fullName || "Channel Name",
    username: userProfile?.username || username,
    subscribersCount: userProfile?.subscribersCount || "0",
    channelsSubscribedToCount: userProfile?.channelsSubscribedToCount || "0",
    isSubscribed: userProfile?.isSubscribed || false,
    isVerified: true,
  };

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlists", label: "Playlists" },
  ];

  const Crosshair = ({ className }) => (
    <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
      <div className="absolute w-full h-[1px] bg-border" />
      <div className="absolute h-full w-[1px] bg-border" />
    </div>
  );

  return (
    <div className="w-full relative min-h-screen bg-background font-inter selection:bg-primary/20">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-72 bg-muted relative rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden group">
        <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            maskImage: "linear-gradient(to top, transparent, black 70%)",
            WebkitMaskImage: "linear-gradient(to top, transparent, black 70%)",
          }}
        />
      </div>

      {/* Channel Info Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 md:-mt-16 mb-6">
          {/* Avatar */}
          <div className="relative group/avatar">
            <img
              src={channelData.avatar}
              alt={channelData.fullName}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-background shadow-2xl object-cover bg-muted transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-1 pt-12 md:pt-20 md:mb-4">
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-3xl md:text-4xl font-black text-foreground font-satoshi tracking-tight">
                {channelData.fullName}
              </h1>
            </div>
            <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-sm md:text-base">
              <span className="font-bold text-primary">@</span>
              <span className="font-medium tracking-tight">{channelData.username}</span>
            </p>
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-1.5">
                <span className="text-foreground font-bold text-xl md:text-lg">
                  {channelData.subscribersCount}
                </span>
                <span className="text-[11px] md:text-sm font-medium text-muted-foreground/60">subscribers</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-1.5">
                <span className="text-foreground font-bold text-xl md:text-lg">
                  {channelData.channelsSubscribedToCount}
                </span>
                <span className="text-[11px] md:text-sm font-medium text-muted-foreground/60">subscribed</span>
              </div>
            </div>
          </div>

          {/* Subscribe Button (Replacing Edit/Add actions) */}
          <div className="md:mb-4 flex gap-3 pt-4 md:pt-0">
            <SubscribeButton
              channelId={channelData._id}
              isSubscribed={channelData.isSubscribed}
              className="!px-8 !py-2.5 !text-sm !font-black !uppercase !tracking-widest hover:bg-foreground/10 active:scale-95 transition-all border border-border/50"
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border/50 mb-8 overflow-x-auto scrollbar-none">
          <nav className="flex gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-bold text-xs uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground/40 hover:text-foreground/60"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" 
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {activeTab === "videos" && (
                    <div className="min-h-[400px]">
                    <VideoProvider username={username} userId={channelData._id}>
                        <VideosTab />
                    </VideoProvider>
                    </div>
                )}
                {activeTab === "playlists" && (
                    <div className="min-h-[400px]">
                    <PlaylistsTab userId={channelData._id} />
                    </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
