import { useContext, createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const { token } = useGlobal();
  const { showToast } = useToast();
  const [allPlaylists, setAllPlaylists] = useState([]);

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

  return (
    <PlaylistContext.Provider
      value={{
        allPlaylists,
        setAllPlaylists,
        createPlaylist: createPlaylistMutation.mutate,
        isCreatingPlaylist: createPlaylistMutation.isPending,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
