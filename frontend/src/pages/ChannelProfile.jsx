import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../ContentApi/ProfileContext";
import { CheckCircle2, X, AtSign, Play, ListPlus, ChevronRight, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";
import { VideoProvider } from "../ContentApi/VideoContext";
import VideosTab from "./VideosTab";
import SubscribeButton from "../project_components/SubscribeButton";
import PlaylistsTab from "./PlaylistsTab";

const Crosshair = ({ className }) => (
  <div
    className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none z-20 ${className}`}
  >
    <div className="absolute w-full h-[1px] bg-border" />
    <div className="absolute h-full w-[1px] bg-border" />
  </div>
);

const ChannelProfile = () => {
  const { username } = useParams();
  const { userProfile, isLoading, isError } = useProfile();
  const [activeTab, setActiveTab] = useState("videos");

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <div className="w-16 h-16 bg-muted/20 flex items-center justify-center rounded-full mb-2">
            <X className="text-muted-foreground w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-foreground font-satoshi uppercase tracking-tight">Channel Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-xs font-inter">
          The channel you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  // Derived data mapping directly from backend response
  const channelData = {
    _id: userProfile?._id || null,
    coverImage: userProfile?.coverImage || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
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

  return (
    <div className="w-full relative min-h-screen bg-background text-foreground animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative w-full h-48 md:h-72 lg:h-80 overflow-hidden isolate border-b border-border/50">
         <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-60 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        
        {/* Crosshair corners for cover image */}
        <Crosshair className="top-0 left-0" />
        <Crosshair className="top-0 right-0" />
        <Crosshair className="bottom-0 left-0" />
        <Crosshair className="bottom-0 right-0" />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative -mt-16 md:-mt-24 z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10 mb-10">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all opacity-50" />
             <div className="relative w-32 h-32 md:w-44 md:h-44 p-1 bg-border rounded-full isolate overflow-hidden shadow-2xl">
                 <img
                  src={channelData.avatar}
                  alt={channelData.fullName}
                  className="w-full h-full rounded-full object-cover bg-muted border-4 border-background shadow-inner"
                />
             </div>
             <Crosshair className="bottom-0 right-0 w-2 h-2" />
          </div>

          {/* Info & Actions */}
          <div className="flex-1 min-w-0 md:pb-4 space-y-4">
             <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-black text-foreground font-satoshi uppercase tracking-tighter">
                    {channelData.fullName}
                  </h1>
                  {channelData.isVerified && (
                     <div className="px-2 py-0.5 border border-border bg-muted/20 rounded-md flex items-center gap-1 mt-1 group cursor-default">
                        <CheckCircle2 size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Verified</span>
                     </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/60">
                   <AtSign size={14} className="text-primary" />
                   <span className="font-bold text-sm tracking-tight">@{channelData.username}</span>
                </div>
             </div>

             <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                <div className="space-y-1">
                  <span className="block text-2xl font-black text-foreground tracking-tighter leading-none mb-1">
                    {channelData.subscribersCount}
                  </span>
                  Subscribers
                </div>
                <div className="w-[1px] h-8 bg-border/50" />
                <div className="space-y-1">
                  <span className="block text-2xl font-black text-foreground tracking-tighter leading-none mb-1">
                    {channelData.channelsSubscribedToCount}
                  </span>
                  Subscribed
                </div>
             </div>

             <div className="pt-2">
                <SubscribeButton
                  channelId={channelData._id}
                  isSubscribed={channelData.isSubscribed}
                />
             </div>
          </div>
        </div>

        {/* Custom Tabs Navigation */}
        <div className="border-y border-border/50 bg-muted/5 flex items-center justify-between mb-10 overflow-x-auto scrollbar-none px-2 md:-mx-8 md:px-8">
           <div className="flex gap-1 md:gap-4 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-md flex items-center gap-2 group ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                    <motion.div 
                        layoutId="activeTabBadge"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-md -z-10" 
                    />
                )}
                {tab.id === 'videos' ? <Play size={10} fill="currentColor" /> : <ListPlus size={12} />}
                {tab.label}
              </button>
            ))}
           </div>
           
           <div className="hidden md:flex items-center gap-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 pointer-events-none select-none">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Live Channel Environment
           </div>
        </div>

        {/* Tab Content Area */}
        <div className="pb-24">
          {activeTab === "videos" && (
             <div className="relative isolate">
                <Crosshair className="-top-1.5 -left-1.5" />
                <Crosshair className="-top-1.5 -right-1.5" />
                
                <VideoProvider username={username} userId={channelData._id}>
                  <VideosTab />
                </VideoProvider>
             </div>
          )}
          
          {activeTab === "playlists" && (
            <div className="relative isolate">
                <Crosshair className="-top-1.5 -left-1.5" />
                <Crosshair className="-top-1.5 -right-1.5" />
                <PlaylistsTab userId={channelData._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
