import { createContext, useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "./GlobalContext";
const MyChannelContext = createContext();

export const useMyChannel = () => useContext(MyChannelContext);

export const MyChannelProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useGlobal();

  const myChannelVideosQuery = useQuery({
    queryKey: ["mychannel", "videos", user?.username],
    queryFn: async () => {
        const res = await axios.get(`write query route for all video`);
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const myChannelSubscriptionsQuery = useQuery({
    queryKey: ["mychannel", "subscriptions", user?.username],
    queryFn: async () => {
        const res = await axios.get(`write query route for all subscriptions`);
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const myChannelPlaylistsQuery = useQuery({
    queryKey: ["mychannel", "playlists", user?.username],
    queryFn: async () => {
        const res = await axios.get(`write query route for all playlists`);
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const mychannelTweetsQuery = useQuery({
    queryKey: ["mychannel", "tweets", user?.username],
    queryFn: async () => {
        const res = await axios.get(`write query route for all tweets`);
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const myChannelAddvideoMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
    },
  });

  const myChannelCreatePlaylistMutation = useMutation({
    mutationFn: async (data) => {
      // data: { name, description }
      const res = await axios.post(
        `http://localhost:8000/api/v1/playlist`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mychannel", "playlists", user?.username]);
    },
  });

  const myChannelTogglePublishMutation = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/videos/toggle/publish/${videoId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
    },
  });

  const myChannelDeleteVideoMutation = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/videos/${videoId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mychannel", "videos", user?.username]);
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
      }}
    >
      {children}
    </MyChannelContext.Provider>
  );
};
