import React, { useState, useEffect } from "react";
import { useGlobal } from "../../ContentApi/GlobalContext";
import { useMyChannel } from "../../ContentApi/myChannelContext";
import {
  Edit3,
  Trash2,
  Plus,
  ListVideo,
  X,
  Users,
  Play,
  Heart,
  Eye,
  TrendingUp,
  BarChart3,
  Clock,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Globe,
  Lock,
  Share2,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VideoCard from "../../project_components/VideoCard";
import PublishVideoModal from "../../project_components/PublishVideoModal";
import { useNavigate } from "react-router-dom";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div
    className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}
  >
    <div className="absolute w-full h-[1px] bg-border" />
    <div className="absolute h-full w-[1px] bg-border" />
  </div>
);

const MyChannelProfile = () => {
  const navigate = useNavigate();
  const { user } = useGlobal();
  const {
    myChannelVideosQuery,
    myChannelStatsQuery,
    myChannelPlaylistsQuery,
    myChannelSubscriptionsQuery,
    myChannelAddvideoMutation,
    myChannelCreatePlaylistMutation,
    myChannelTogglePublishMutation,
    myChannelDeleteVideoMutation,
    myChannelUpdateVideoMutation,
  } = useMyChannel();

  const [activeTab, setActiveTab] = useState("videos");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  // Edit Video State
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    thumbnailFile: null,
  });

  const [playlistForm, setPlaylistForm] = useState({
    name: "",
    description: "",
  });

  const channelData = {
    _id: user?._id,
    coverImage:
      user?.coverImage ||
      "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000&auto=format&fit=crop",
    avatar: user?.avatar,
    fullName: user?.fullName || "My Channel",
    username: user?.username || "username",
    subscribersCount: myChannelStatsQuery.data?.total_subscribers ?? 0,
    followingCount: myChannelStatsQuery.data?.total_following ?? 0,
    totalVideos: myChannelStatsQuery.data?.total_videos ?? 0,
  };

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlists", label: "Playlists" },
    { id: "stats", label: "Insights" },
    { id: "subscribed", label: "Following" },
  ];

  // --- Handlers ---
  const handleTogglePublish = async (videoId) => {
    await myChannelTogglePublishMutation.mutateAsync(videoId);
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await myChannelDeleteVideoMutation.mutateAsync(videoId);
    }
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
      thumbnailFile: null,
    });
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    if (editForm.thumbnailFile) {
      formData.append("thumbnail", editForm.thumbnailFile);
    }

    await myChannelUpdateVideoMutation.mutateAsync({
      videoId: editingVideo._id,
      formData,
    });
    setEditingVideo(null);
  };

  const handlePlaylistInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlaylist = async () => {
    await myChannelCreatePlaylistMutation.mutateAsync(playlistForm);
    setIsPlaylistModalOpen(false);
    setPlaylistForm({ name: "", description: "" });
  };

  return (
    <div className="   w-full relative min-h-screen bg-background font-inter">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-72 bg-muted relative rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden group">
        <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            maskImage: "linear-gradient(to top, transparent, black 100%)",
            WebkitMaskImage: "linear-gradient(to top, transparent, black 100%)",
          }}
        />
      </div>

      {/* Channel Info Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 md:-mt-16 mb-10 relative z-10">
          <div className="relative group/avatar">
            <img
              src={channelData.avatar}
              alt={channelData.fullName}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-background shadow-2xl object-cover bg-muted transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>

          <div className="flex-1 md:pt-20 md:mb-4">
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-3xl md:text-4xl font-black text-foreground font-satoshi tracking-tight">
                {channelData.fullName}
              </h1>
            </div>
            <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-sm md:text-base">
              <span className="font-bold text-primary">@</span>
              <span className="font-medium tracking-tight">
                {channelData.username}
              </span>
            </p>
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-1.5">
                <span className="text-foreground font-bold text-xl md:text-lg tabular-nums">
                  {channelData.subscribersCount}
                </span>
                <span className="text-[11px] md:text-sm font-medium text-muted-foreground/60">
                  subscribers
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-1.5">
                <span className="text-foreground font-bold text-xl md:text-lg tabular-nums">
                  {channelData.channelsSubscribedToCount ||
                    channelData.followingCount}
                </span>
                <span className="text-[11px] md:text-sm font-medium text-muted-foreground/60">
                  subscribed
                </span>
              </div>
            </div>
          </div>

          <div className="md:mb-4 flex gap-3 pt-4 md:pt-0">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-white text-black border border-neutral-200 rounded-full text-sm font-satoshi font-bold tracking-tight hover:bg-neutral-50 transition-all active:scale-95 shadow-sm"
            >
              <Plus size={14} />
              Publish
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="p-2.5 border border-border rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            >
              <Settings size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border/50 mb-8 overflow-x-auto no-scrollbar">
          <nav className="flex gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-bold text-sm transition-all relative whitespace-nowrap tracking-tight ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground/40 hover:text-foreground/60"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Section */}
        <div className="pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "videos" && (
                <div className="relative border-t border-l border-border bg-background">
                  <Crosshair className="-top-1.5 -left-1.5 z-20" />
                  <Crosshair className="-top-1.5 -right-1.5 z-20" />
                  <Crosshair className="-bottom-1.5 -left-1.5 z-20" />
                  <Crosshair className="-bottom-1.5 -right-1.5 z-20" />

                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                    }}
                  >
                    {myChannelVideosQuery.isLoading ? (
                      <div className="col-span-full py-40 text-center text-sm font-medium text-muted-foreground/30 animate-pulse font-satoshi">
                        Loading assets...
                      </div>
                    ) : myChannelVideosQuery.data?.length > 0 ? (
                      myChannelVideosQuery.data.map((video) => (
                        <div
                          key={video._id}
                          className="relative border-r border-b border-border p-4 hover:bg-muted/30 transition-colors group"
                        >
                          <Crosshair className="-bottom-1.5 -right-1.5 z-10" />

                          <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(video);
                              }}
                              className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-xl text-foreground hover:bg-white transition-all transform hover:scale-110"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVideo(video._id);
                              }}
                              className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-xl text-red-600 hover:bg-white transition-all transform hover:scale-110"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="relative">
                            <VideoCard
                              _id={video._id}
                              title={video.title}
                              owner={user}
                              views={video.views || 0}
                              createdAt={video.createdAt}
                              thumbnail={video.thumbnail}
                              duration={video.duration}
                            />
                          </div>

                          <div className="mt-4 flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleTogglePublish(video._id)}
                                className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-all ${
                                  video.isPublished
                                    ? "bg-primary"
                                    : "bg-neutral-200"
                                }`}
                              >
                                <span
                                  className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${video.isPublished ? "translate-x-4" : "translate-x-1"}`}
                                />
                              </button>
                              <span className="text-[10px] font-bold text-muted-foreground/60 tracking-tight">
                                {video.isPublished
                                  ? "Published"
                                  : "Unpublished"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-40 flex flex-col items-center border-r border-b border-border">
                        <div className="w-16 h-16 border border-dashed border-border rounded-full flex items-center justify-center mb-6 text-muted-foreground/20">
                          <Plus size={24} />
                        </div>
                        <h3 className="text-lg font-bold font-satoshi text-foreground/50 tracking-tight">
                          Database is currently empty
                        </h3>
                        <button
                          onClick={() => setIsVideoModalOpen(true)}
                          className="mt-2 text-xs font-bold text-primary hover:underline"
                        >
                          Publish your first asset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "playlists" && (
                <div className="relative border-t border-l border-border bg-background">
                  <Crosshair className="-top-1.5 -left-1.5 z-20" />
                  <Crosshair className="-top-1.5 -right-1.5 z-20" />
                  <Crosshair className="-bottom-1.5 -left-1.5 z-20" />
                  <Crosshair className="-bottom-1.5 -right-1.5 z-20" />

                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                    }}
                  >
                    {myChannelPlaylistsQuery.isLoading ? (
                      <div className="col-span-full py-40 text-center text-sm font-medium text-muted-foreground/30 animate-pulse font-satoshi">
                        Fetching tracks...
                      </div>
                    ) : myChannelPlaylistsQuery.data?.length > 0 ? (
                      myChannelPlaylistsQuery.data.map((playlist) => (
                        <div
                          key={playlist._id}
                          onClick={() => navigate(`/playlists/${playlist._id}`)}
                          className="relative border-r border-b border-border p-8 hover:bg-muted/30 transition-all group cursor-pointer"
                        >
                          <Crosshair className="-bottom-1.5 -right-1.5 z-10" />
                          <div className="mb-6">
                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center border border-border group-hover:border-primary group-hover:bg-primary/5 transition-all mb-6">
                              <ListVideo
                                size={20}
                                className="text-muted-foreground/60 group-hover:text-primary"
                              />
                            </div>
                            <h3 className="text-xl font-bold font-satoshi group-hover:text-primary transition-colors tracking-tight">
                              {playlist.name}
                            </h3>
                            <p className="text-xs text-muted-foreground/60 line-clamp-2 mt-2 leading-relaxed h-8">
                              {playlist.description ||
                                "Collection of curated content."}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                            <span className="text-[10px] font-bold font-satoshi tabular-nums">
                              {playlist.videos.length} Assets
                            </span>
                            <ChevronRight
                              size={14}
                              className="text-muted-foreground/40 group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-40 border-r border-b border-border text-center flex flex-col items-center">
                        <ListVideo
                          className="text-muted-foreground/10 mb-4"
                          size={32}
                        />
                        <h4 className="text-sm font-bold text-foreground/40 tracking-tight">
                          No collections found
                        </h4>
                        <button
                          onClick={() => setIsPlaylistModalOpen(true)}
                          className="mt-2 text-xs font-bold text-primary hover:underline"
                        >
                          Create a new playlist
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-border relative">
                    <Crosshair className="-top-1.5 -left-1.5" />
                    <Crosshair className="-top-1.5 -right-1.5" />
                    <Crosshair className="-bottom-1.5 -left-1.5" />
                    <Crosshair className="-bottom-1.5 -right-1.5" />
                    {[
                      {
                        label: "Community",
                        value: channelData.subscribersCount,
                        icon: Users,
                      },
                      {
                        label: "Reach",
                        value: myChannelStatsQuery.data?.total_views || 0,
                        icon: Eye,
                      },
                      {
                        label: "Impact",
                        value: myChannelStatsQuery.data?.total_likes || 0,
                        icon: Heart,
                      },
                      {
                        label: "Assets",
                        value: channelData.totalVideos,
                        icon: Play,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-10 border-r border-b border-border group hover:bg-muted/10 transition-colors"
                      >
                        <div className="p-3 bg-muted rounded-2xl border border-border w-fit mb-8 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                          <stat.icon
                            size={20}
                            className="text-muted-foreground/50 group-hover:text-primary"
                          />
                        </div>
                        <p className="text-[10px] font-bold tracking-tight text-muted-foreground/40 mb-1">
                          {stat.label}
                        </p>
                        <h4 className="text-4xl font-bold font-satoshi tabular-nums tracking-tighter">
                          {stat.value}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "subscribed" && (
                <div className="relative border-t border-l border-border">
                  <Crosshair className="-top-1.5 -left-1.5 z-20" />
                  <Crosshair className="-top-1.5 -right-1.5 z-20" />
                  <Crosshair className="-bottom-1.5 -left-1.5 z-20" />
                  <Crosshair className="-bottom-1.5 -right-1.5 z-20" />
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    }}
                  >
                    {myChannelSubscriptionsQuery.isLoading ? (
                      <div className="col-span-full py-40 text-center text-sm font-medium text-muted-foreground/20 animate-pulse font-satoshi">
                        Syncing subscription nodes...
                      </div>
                    ) : myChannelSubscriptionsQuery.data?.length > 0 ? (
                      myChannelSubscriptionsQuery.data.map((sub) => (
                        <div
                          key={sub._id}
                          className="p-8 border-r border-b border-border hover:bg-muted/10 transition-all flex items-center gap-6 group cursor-pointer"
                          onClick={() => navigate(`/c/${sub.username}`)}
                        >
                          <Crosshair className="-bottom-1.5 -right-1.5 z-10" />
                          <img
                            src={
                              sub.avatar ||
                              "https://picsum.photos/seed/user/100/100"
                            }
                            alt=""
                            className="w-16 h-16 rounded-full border border-border shadow-md group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="flex flex-col min-w-0">
                            <h4 className="text-lg font-bold font-satoshi truncate group-hover:text-primary transition-colors tracking-tight">
                              {sub.fullName || sub.username}
                            </h4>
                            <p className="text-[10px] font-medium text-muted-foreground/40 tracking-tight">
                              @{sub.username}
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            className="ml-auto text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-40 border-r border-b border-border text-center text-muted-foreground/20 text-sm font-medium tracking-tight">
                        No active subscriptions.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add Video Modal */}
      <PublishVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={async (formData) => {
          await myChannelAddvideoMutation.mutateAsync(formData);
        }}
        mutation={myChannelAddvideoMutation}
      />

      {/* Edit Video Modal */}
      <AnimatePresence>
        {editingVideo && (
          <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-10 relative overflow-hidden"
            >
              <button
                onClick={() => setEditingVideo(null)}
                className="absolute top-8 right-8 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black font-satoshi tracking-tight mb-10 text-foreground">
                Sync manifest
              </h2>

              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-64 space-y-4">
                  <div className="aspect-video rounded-3xl bg-muted border border-border overflow-hidden relative group">
                    <img
                      src={editingVideo.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Plus className="text-white" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            thumbnailFile: e.target.files[0],
                          }))
                        }
                      />
                    </label>
                  </div>
                  <p className="text-xs font-medium text-neutral-400 tracking-tight text-center font-satoshi">
                    Update visual key
                  </p>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 tracking-tight ml-1 font-satoshi">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl focus:ring-1 focus:ring-primary outline-none font-satoshi font-bold text-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-satoshi font-medium text-neutral-400 tracking-tight ml-1">
                      Briefing
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full bg-muted/30 border border-border px-4 py-4 rounded-2xl focus:ring-1 focus:ring-primary outline-none text-sm h-32 resize-none text-foreground"
                    />
                  </div>
                  <button
                    onClick={handleEditSave}
                    disabled={myChannelUpdateVideoMutation.isPending}
                    className="w-full bg-primary text-white font-medium tracking-wide text-sm py-3  rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                  >
                    {myChannelUpdateVideoMutation.isPending
                      ? "Syncing changes..."
                      : "Update manifest"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Playlist Modal */}
      <AnimatePresence>
        {isPlaylistModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 relative"
            >
              <button
                onClick={() => setIsPlaylistModalOpen(false)}
                className="absolute top-8 right-8 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black font-satoshi tracking-tight mb-10 text-foreground">
                New collection
              </h2>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 tracking-tight ml-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={playlistForm.name}
                    name="name"
                    onChange={handlePlaylistInputChange}
                    className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl outline-none font-satoshi font-bold text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 tracking-tight ml-1">
                    Briefing
                  </label>
                  <textarea
                    value={playlistForm.description}
                    name="description"
                    onChange={handlePlaylistInputChange}
                    className="w-full bg-muted/30 border border-border px-4 py-4 rounded-2xl outline-none text-sm h-24 resize-none text-foreground"
                  />
                </div>
                <button
                  onClick={handleCreatePlaylist}
                  className="w-full bg-primary text-white font-bold tracking-tight text-sm py-4 rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  Mount collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyChannelProfile;
