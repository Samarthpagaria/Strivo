import React, { useState } from "react";
import { useGlobal } from "../../ContentApi/GlobalContext";
import { useMyChannel } from "../../ContentApi/myChannelContext";
import {
  CheckCircle2,
  Upload,
  X,
  ImagePlus,
  Edit3,
  Trash2,
  MoreVertical,
  Plus,
} from "lucide-react";
import VideoCard from "../../project_components/VideoCard";

const MyChannelProfile = () => {
  const { user } = useGlobal();
  const {
    myChannelVideosQuery,
    myChannelPlaylistsQuery,
    myChannelSubscriptionsQuery,
    myChannelAddvideoMutation,
    myChannelCreatePlaylistMutation,
    myChannelTogglePublishMutation,
    myChannelDeleteVideoMutation,
  } = useMyChannel();

  const [activeTab, setActiveTab] = useState("videos");

  // Modal States
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  // Forms
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const [playlistForm, setPlaylistForm] = useState({
    name: "",
    description: "",
  });

  const channelData = {
    _id: user?._id,
    coverImage: user?.coverImage || "https://picsum.photos/seed/cover/1200/300",
    avatar: user?.avatar || "https://picsum.photos/seed/avatar/200/200",
    fullName: user?.fullName || "My Channel",
    username: user?.username || "username",
    subscribersCount: "0",
    channelsSubscribedToCount: "0",
    isVerified: true,
  };

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlists", label: "Playlists" },
    { id: "subscribed", label: "Subscribed" },
  ];

  // --- Handlers ---

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setVideoForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handlePlaylistInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.videoFile || !videoForm.thumbnail) return;

    const formData = new FormData();
    formData.append("title", videoForm.title);
    formData.append("description", videoForm.description);
    formData.append("videoFile", videoForm.videoFile);
    formData.append("thumbnail", videoForm.thumbnail);

    await myChannelAddvideoMutation.mutateAsync(formData);
    setTimeout(() => {
      setIsVideoModalOpen(false);
      setVideoForm({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });
      myChannelAddvideoMutation.reset();
    }, 2000);
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!playlistForm.name) return;

    await myChannelCreatePlaylistMutation.mutateAsync(playlistForm);
    if (myChannelCreatePlaylistMutation.isSuccess) {
      setIsPlaylistModalOpen(false);
      setPlaylistForm({ name: "", description: "" });
      myChannelCreatePlaylistMutation.reset();
    }
  };

  const handleTogglePublish = async (videoId) => {
    await myChannelTogglePublishMutation.mutateAsync(videoId);
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await myChannelDeleteVideoMutation.mutateAsync(videoId);
    }
  };

  // Close modals on success (alternate check)
  if (myChannelAddvideoMutation.isSuccess && isVideoModalOpen) {
    setTimeout(() => {
      setIsVideoModalOpen(false);
      myChannelAddvideoMutation.reset();
    }, 1500);
  }
  if (myChannelCreatePlaylistMutation.isSuccess && isPlaylistModalOpen) {
    setTimeout(() => {
      setIsPlaylistModalOpen(false);
      myChannelCreatePlaylistMutation.reset();
    }, 500);
  }

  return (
    <div className="w-full relative min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info Section */}
      <div className="max-w-6xl  mx-auto px-4 md:px-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 md:-mt-16 mb-6">
          <div className="relative">
            <img
              src={channelData.avatar}
              alt={channelData.fullName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
          </div>

          <div className="flex-1 pt-8 md:mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {channelData.fullName}
              </h1>
              {channelData.isVerified && (
                <CheckCircle2 className="w-6 h-6 text-blue-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600 mb-2">@{channelData.username}</p>
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

          <div className="md:mb-4 flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <ImagePlus className="w-4 h-4" />
              Add Video
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      <th className="px-6 py-4 w-24">Status</th>
                      <th className="px-6 py-4 w-32">State</th>
                      <th className="px-6 py-4">Video</th>
                      <th className="px-6 py-4">Likes</th>
                      <th className="px-6 py-4">Date Uploaded</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myChannelVideosQuery.isLoading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Loading videos...
                        </td>
                      </tr>
                    ) : Array.isArray(myChannelVideosQuery.data) &&
                      myChannelVideosQuery.data.length > 0 ? (
                      myChannelVideosQuery.data.map((video) => (
                        <tr
                          key={video._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {/* Toggle Publish Switch */}
                            <button
                              onClick={() => handleTogglePublish(video._id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                video.isPublished
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  video.isPublished
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                video.isPublished
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}
                            >
                              {video.isPublished ? "Published" : "Unpublished"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium text-gray-900 truncate max-w-xs">
                                {video.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {/* Likes count not available in current API response, keeping placeholder or 0 */}
                            0
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(video._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No videos found. Start by uploading one!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "playlists" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Playlists
                </h2>
                <button
                  onClick={() => setIsPlaylistModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Playlist
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myChannelPlaylistsQuery.isLoading ? (
                  <div className="col-span-full text-center py-12">
                    Loading playlists...
                  </div>
                ) : myChannelPlaylistsQuery.data?.length > 0 ? (
                  myChannelPlaylistsQuery.data.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {playlist.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                        <span>
                          Updated{" "}
                          {new Date(playlist.updatedAt).toLocaleDateString()}
                        </span>
                        <span>View Playlist →</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">
                      No playlists created yet.
                    </p>
                    <button
                      onClick={() => setIsPlaylistModalOpen(true)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Create one now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "subscribed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myChannelSubscriptionsQuery.isLoading ? (
                <div className="col-span-full text-center py-12">
                  Loading subscriptions...
                </div>
              ) : myChannelSubscriptionsQuery.data?.length > 0 ? (
                myChannelSubscriptionsQuery.data.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={
                        sub.subscribedChannel?.[0]?.avatar ||
                        "https://picsum.photos/seed/user/100/100"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {sub.subscribedChannel?.[0]?.username}
                      </h4>
                      <p className="text-xs text-gray-500">Subscribed</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No subscriptions yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-150 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Upload Video
            </h2>

            {myChannelAddvideoMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
                <p className="text-lg font-medium text-blue-600">
                  Uploading Video...
                </p>
                <p className="text-sm text-gray-500">
                  Please wait, do not close this window.
                </p>
              </div>
            ) : myChannelAddvideoMutation.isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  Uploaded Successfully!
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddVideo} className="space-y-5">
                {myChannelAddvideoMutation.isError && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Error uploading video. Please try again.
                  </div>
                )}

                {/* Thumbnail Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Thumbnail
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all relative group">
                    <input
                      type="file"
                      name="thumbnail"
                      onChange={handleVideoFileChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    {videoForm.thumbnail ? (
                      <div className="flex flex-col items-center text-green-600">
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <p className="text-sm font-medium truncate w-full px-4">
                          {videoForm.thumbnail.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                        <ImagePlus className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">
                          Click to upload thumbnail
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Video File
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all relative group">
                    <input
                      type="file"
                      name="videoFile"
                      onChange={handleVideoFileChange}
                      accept="video/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    {videoForm.videoFile ? (
                      <div className="flex flex-col items-center text-green-600">
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <p className="text-sm font-medium truncate w-full px-4">
                          {videoForm.videoFile.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">
                          Click to upload video
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={videoForm.title}
                    onChange={handleVideoInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Video title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={videoForm.description}
                    onChange={handleVideoInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                    placeholder="What's this video about?"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Upload Video
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsPlaylistModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Create New Playlist
            </h2>

            <form onSubmit={handleCreatePlaylist} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Playlist Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={playlistForm.name}
                  onChange={handlePlaylistInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. My Favorite Songs"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={playlistForm.description}
                  onChange={handlePlaylistInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                  placeholder="What's this playlist about?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={myChannelCreatePlaylistMutation.isPending}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {myChannelCreatePlaylistMutation.isPending
                  ? "Creating..."
                  : "Create Playlist"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChannelProfile;
