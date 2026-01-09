import { createContext, useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";

const VideoDetailContext = createContext();

export const useVideoDetail = (videoId) => {
  const context = useContext(VideoDetailContext);
  if (!context) {
    throw new Error("useVideoDetail must be used within a VideoDetailProvider");
  }

  const { token, queryClient, showToast } = context;

  const videoQuery = useQuery({
    queryKey: ["videoDetail", videoId],
    queryFn: async () => {
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/${videoId}`,
        config
      );
      return res.data.data;
    },
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const toggleVideoLikeMutation = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data, vidId) => {
      queryClient.invalidateQueries(["videoDetail", vidId]);
      showToast(data?.message || "Like status updated");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update like status";
      showToast(errorMessage);
    },
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: async (channelId) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate the current video query to update subscription status
      queryClient.invalidateQueries(["videoDetail", videoId]);
      showToast(data?.message || "Subscription updated");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to toggle subscription";
      showToast(errorMessage);
    },
  });

  return {
    ...videoQuery,
    toggleVideoLikeMutation,
    toggleSubscriptionMutation,
  };
};

export const VideoDetailProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { token } = useGlobal();
  const { showToast } = useToast();

  return (
    <VideoDetailContext.Provider
      value={{
        token,
        queryClient,
        showToast,
      }}
    >
      {children}
    </VideoDetailContext.Provider>
  );
};
