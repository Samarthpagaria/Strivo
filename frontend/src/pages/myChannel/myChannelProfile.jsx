import React, { useState } from "react";
import { useGlobal } from "../../ContentApi/GlobalContext";
import { useMyChannel } from "../../ContentApi/myChannelContext";
import { Edit3, Trash2, Plus, ImagePlus, X } from "lucide-react";
import VideoCard from "../../project_components/VideoCard";
import PublishVideoModal from "../../project_components/PublishVideoModal";
import { NoiseBackground } from "@/components/ui/noise-background";
import { useNavigate } from "react-router-dom";
const MyChannelProfile = () => {
  const navigate = useNavigate();
  const { user } = useGlobal();
  const {
    myChannelVideosQuery,
    myChannelPlaylistsQuery,
    myChannelSubscriptionsQuery,
    myChannelAddvideoMutation,
    myChannelCreatePlaylistMutation,
    myChannelTogglePublishMutation,
    myChannelDeleteVideoMutation,
    myChannelUpdateVideoMutation,
  } = useMyChannel();

  const [activeTab, setActiveTab] = useState("videos");

  // Modal States
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  // Edit States
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    thumbnailFile: null,
  });

  // Forms
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
  };

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlists", label: "Playlists" },
    { id: "subscribed", label: "Subscribed" },
  ];

  // --- Handlers ---

  const handleAddVideo = async (formData) => {
    await myChannelAddvideoMutation.mutateAsync(formData);
  };

  const handlePlaylistInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistForm((prev) => ({ ...prev, [name]: value }));
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

  const handleEditClick = (video) => {
    setEditingVideoId(video._id);
    setEditForm({
      title: video.title,
      description: video.description,
      thumbnailFile: null,
    });
  };

  const handleEditCancel = () => {
    setEditingVideoId(null);
    setEditForm({ title: "", description: "", thumbnailFile: null });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm((prev) => ({ ...prev, thumbnailFile: file }));
    }
  };

  const handleEditSave = async (videoId) => {
    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    if (editForm.thumbnailFile) {
      formData.append("thumbnail", editForm.thumbnailFile);
    }

    await myChannelUpdateVideoMutation.mutateAsync({ videoId, formData });
    handleEditCancel();
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
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-neutral-500 to-neutral-00 relative rounded-b-4xl overflow-hidden">
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

          <div className="flex-1 pt-20 md:mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {channelData.fullName}
              </h1>
            </div>
            <p className="text-gray-600 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-700 via-amber-500 to-yellow-600 font-semibold">
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

          <div className="md:mb-4 flex gap-3">
            <NoiseBackground
              containerClassName="w-fit p-2 rounded-full"
              gradientColors={[
                "rgb(255, 100, 150)",
                "rgb(100, 150, 255)",
                "rgb(255, 200, 100)",
              ]}
              animating={true}
            >
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="h-full w-full cursor-pointer rounded-full bg-gradient-to-r from-neutral-100 via-neutral-100 to-white  px-3 py-1.5 text-sm text-black shadow-[0px_2px_0px_0px_rgba(245,245,245,1)_inset,0px_0.5px_1px_0px_rgba(163,163,163,1)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_rgba(10,10,10,1)_inset,0px_1px_0px_0px_rgba(38,38,38,1)] flex items-center gap-2 font-semibold"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Add Video
              </button>
            </NoiseBackground>
            <NoiseBackground
              containerClassName="w-fit p-2 rounded-full "
              gradientColors={[
                "rgb(255, 100, 150)",
                "rgb(100, 150, 255)",
                "rgb(255, 200, 100)",
              ]}
              animating={true}
            >
              <button
                onClick={() => navigate("/settings")}
                className="h-full w-full cursor-pointer rounded-full bg-transparent px-3 py-1.5 text-sm text-black transition-all duration-100 active:scale-98 flex items-center gap-2 font-semibold opacity-100 "
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </NoiseBackground>
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
                        <React.Fragment key={video._id}>
                          <tr className="hover:bg-gray-50 transition-colors">
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
                                {video.isPublished
                                  ? "Published"
                                  : "Unpublished"}
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
                                <button
                                  onClick={() => handleEditClick(video)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                >
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
                          {/* Expandable Edit Row */}
                          {editingVideoId === video._id && (
                            <tr>
                              <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                <div className="max-w-4xl">
                                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Edit Video
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Thumbnail Section */}
                                    <div className="space-y-3">
                                      <label className="block text-xs font-medium text-gray-700">
                                        Current Thumbnail
                                      </label>
                                      <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                          src={video.thumbnail}
                                          alt="Thumbnail"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <label className="block rounded-br-none">
                                        <span className="sr-only ">
                                          Choose thumbnail
                                        </span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={handleThumbnailChange}
                                          className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gradient-to-r file:from-gray-900 file:via-gray-800 file:via-gray-700 file:to-white file:mask-r-from-95% file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer border rounded-xl file:rounded-br-none file:rounded-tr-none "
                                        />
                                      </label>
                                      {editForm.thumbnailFile && (
                                        <p className="text-xs text-green-600">
                                          New thumbnail selected
                                        </p>
                                      )}
                                    </div>

                                    {/* Form Fields */}
                                    <div className="md:col-span-2 space-y-4">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                          Title
                                        </label>
                                        <input
                                          type="text"
                                          name="title"
                                          value={editForm.title}
                                          onChange={handleEditInputChange}
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                          Description
                                        </label>
                                        <textarea
                                          name="description"
                                          value={editForm.description}
                                          onChange={handleEditInputChange}
                                          rows="4"
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-3 pt-2">
                                        <button
                                          onClick={handleEditCancel}
                                          disabled={
                                            myChannelUpdateVideoMutation.isPending
                                          }
                                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleEditSave(video._id)
                                          }
                                          disabled={
                                            myChannelUpdateVideoMutation.isPending
                                          }
                                          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {myChannelUpdateVideoMutation.isPending
                                            ? "Saving..."
                                            : "Save Changes"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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
      <PublishVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={handleAddVideo}
        mutation={myChannelAddvideoMutation}
      />

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
