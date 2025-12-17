import { useContext, createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const { token, user, isAuthenticated } = useGlobal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [allPlaylists, setAllPlaylists] = useState([]);

  // Get user ID (handle both _id and id)
  const userId = user?._id || user?.id;

  //create playlist mutation with enhanced features
  const createPlaylistMutation = useMutation({
    mutationFn: async (playlistData) => {
      const res = await axios.post(
        "http://localhost:8000/api/v1/playlist",
        playlistData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Add the new playlist to the list
      setAllPlaylists((prev) => [...prev, data.data]);
      showToast(data?.message || "Playlist created successfully! 🎉");
      console.log("Playlist created successfully:", data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create playlist. Please try again.";
      showToast(errorMessage);
      console.error("Error creating playlist:", error);
      console.error("Error details:", error.response?.data);
    },
  });
  //add video to playlist
  const addVideoToPlaylistMutation = useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/playlist/add/${videoId}/${playlistId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data?.message || "Video added to playlist successfully! 🎉");
      console.log("Video added to playlist successfully:", data);
      // Invalidate and refetch playlists to update UI
      queryClient.invalidateQueries({ queryKey: ["allPlaylists", userId] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add video to playlist. Please try again.";
      showToast(errorMessage);
      console.error("Error adding video to playlist:", error);
      console.error("Error details:", error.response?.data);
    },
  });

  // remove video from playlist
  const removeVideoFromPlaylistMutation = useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/playlist/remove/${videoId}/${playlistId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast(
        data?.message || "Video removed from playlist successfully! 🎉"
      );
      console.log("Video removed from playlist successfully:", data);
      // Invalidate and refetch playlists to update UI
      queryClient.invalidateQueries({ queryKey: ["allPlaylists", userId] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to remove video from playlist. Please try again.";
      showToast(errorMessage);
      console.error("Error removing video from playlist:", error);
      console.error("Error details:", error.response?.data);
    },
  });

  //fetch all playlist
  const fetchAllPlaylistsQuery = useQuery({
    queryKey: ["allPlaylists", userId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    enabled: isAuthenticated && !!userId, // Only fetch when user is authenticated and has an ID
  });

  // Handle query response (data and errors)
  useEffect(() => {
    if (fetchAllPlaylistsQuery.data?.data) {
      setAllPlaylists(fetchAllPlaylistsQuery.data.data);
    }

    if (fetchAllPlaylistsQuery.isError) {
      const errorMessage =
        fetchAllPlaylistsQuery.error?.response?.data?.message ||
        "Failed to fetch playlists. Please try again.";
      showToast(errorMessage);
      console.error("Error fetching playlists:", fetchAllPlaylistsQuery.error);
    }
  }, [
    fetchAllPlaylistsQuery.data,
    fetchAllPlaylistsQuery.isError,
    fetchAllPlaylistsQuery.error,
    showToast,
  ]);

  return (
    <PlaylistContext.Provider
      value={{
        allPlaylists,
        setAllPlaylists,
        createPlaylist: createPlaylistMutation.mutate,
        isCreatingPlaylist: createPlaylistMutation.isPending,
        isLoadingPlaylists: fetchAllPlaylistsQuery.isLoading,
        refetchPlaylists: fetchAllPlaylistsQuery.refetch,
        addVideoToPlaylist: addVideoToPlaylistMutation,
        isAddingVideoToPlaylist: addVideoToPlaylistMutation.isPending,
        errorAddingVideoToPlaylist: addVideoToPlaylistMutation.error,
        // remove video from playlist
        removeVideoFromPlaylist: removeVideoFromPlaylistMutation,
        isRemovingVideoFromPlaylist: removeVideoFromPlaylistMutation.isPending,
        errorRemovingVideoFromPlaylist: removeVideoFromPlaylistMutation.error,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
