import { createContext, useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";
const MyChannelContext = createContext();

export const useMyChannel = () => useContext(MyChannelContext);

export const MyChannelProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, token } = useGlobal();
  const { showToast } = useToast();

  const myChannelVideosQuery = useQuery({
    queryKey: ["mychannel", "videos", user?.username],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos?userId=${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data.videos;
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const myChannelSubscriptionsQuery = useQuery({
    queryKey: ["mychannel", "subscriptions", user?.username],
    queryFn: async () => {
      const res = await axios.get(`write query route for all subscriptions`);
      return res.data;
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const myChannelPlaylistsQuery = useQuery({
    queryKey: ["mychannel", "playlists", user?.username],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    enabled: !!user?._id && !!isAuthenticated && !!token,
  });

  const mychannelTweetsQuery = useQuery({
    queryKey: ["mychannel", "tweets", user?.username],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/tweets/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    enabled: !!user?._id && !!isAuthenticated && !!token,
  });

  const myChannelAddvideoMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
      showToast(data?.message || "Video uploaded successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to upload video";
      showToast(errorMessage);
    },
  });

  const myChannelCreatePlaylistMutation = useMutation({
    mutationFn: async (data) => {
      // data: { name, description }
      const res = await axios.post(
        `http://localhost:8000/api/v1/playlist`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["mychannel", "playlists", user?.username]);
      showToast(data?.message || "Playlist created successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create playlist";
      showToast(errorMessage);
    },
  });

  const myChannelTogglePublishMutation = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/videos/toggle/publish/${videoId}`,
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
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
      showToast(data?.message || "Video status updated!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update video status";
      showToast(errorMessage);
    },
  });

  const myChannelDeleteVideoMutation = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/videos/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
      showToast(data?.message || "Video deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete video";
      showToast(errorMessage);
    },
  });

  const myChannelUpdateVideoMutation = useMutation({
    mutationFn: async ({ videoId, formData }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/videos/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
      showToast(data?.message || "Video updated successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update video";
      showToast(errorMessage);
    },
  });

  const myChannelDeletePlaylistMutation = useMutation({
    mutationFn: async (playlistId) => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/playlist/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["mychannel", "playlists", user?.username]);
      showToast(data?.message || "Playlist deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete playlist";
      showToast(errorMessage);
    },
  });

  const myChannelAddVideoToPlaylistMutation = useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/playlist/add/${videoId}/${playlistId}`,
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
      queryClient.invalidateQueries(["mychannel", "playlists", user?.username]);
      showToast(data?.message || "Video added to playlist!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to add video to playlist";
      showToast(errorMessage);
    },
  });

  const myChannelRemoveVideoFromPlaylistMutation = useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/playlist/remove/${videoId}/${playlistId}`,
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
      queryClient.invalidateQueries(["mychannel", "playlists", user?.username]);
      showToast(data?.message || "Video removed from playlist!");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to remove video from playlist";
      showToast(errorMessage);
    },
  });

  return (
    <MyChannelContext.Provider
      value={{
        myChannelVideosQuery,
        myChannelSubscriptionsQuery,
        myChannelPlaylistsQuery,
        mychannelTweetsQuery,
        myChannelAddvideoMutation,
        myChannelCreatePlaylistMutation,
        myChannelTogglePublishMutation,
        myChannelDeleteVideoMutation,
        myChannelUpdateVideoMutation,
        myChannelDeletePlaylistMutation,
        myChannelAddVideoToPlaylistMutation,
        myChannelRemoveVideoFromPlaylistMutation,
      }}
    >
      {children}
    </MyChannelContext.Provider>
  );
};
