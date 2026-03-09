import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../ContentApi/ProfileContext";
import { CheckCircle2 } from "lucide-react";
import { VideoProvider } from "../ContentApi/VideoContext";
import VideosTab from "./VideosTab";
import SubscribeButton from "../project_components/SubscribeButton";

const ChannelProfile = () => {
  const { username } = useParams();
  const { userProfile, isLoading, isError } = useProfile();
  const [activeTab, setActiveTab] = useState("videos");

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

  return (
    <div className="w-full relative min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 bg-linear-to-r from-neutral-500 to-neutral-400 relative rounded-b-4xl overflow-hidden">
        <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 md:-mt-16 mb-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={channelData.avatar}
              alt={channelData.fullName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-1 pt-20 md:mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {channelData.fullName}
              </h1>
              {channelData.isVerified && (
                <CheckCircle2 className="w-6 h-6 text-blue-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600 mb-2">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-rose-700 via-amber-500 to-yellow-600 font-semibold">
                @
              </span>
              {channelData.username}
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>
                <strong className="text-gray-900">
                  {channelData.subscribersCount}
                </strong>{" "}
                subscribers
              </span>
              <span>
                <strong className="text-gray-900">
                  {channelData.channelsSubscribedToCount}
                </strong>{" "}
                subscribed
              </span>
            </div>
          </div>

          {/* Subscribe Button (Replacing Edit/Add actions) */}
          <div className="md:mb-4 flex gap-3">
            <SubscribeButton
              channelId={channelData._id}
              isSubscribed={channelData.isSubscribed}
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === "videos" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <VideoProvider username={username} userId={channelData._id}>
                <VideosTab />
              </VideoProvider>
            </div>
          )}
          {activeTab === "playlists" && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">
                This channel has not created any playlists yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
