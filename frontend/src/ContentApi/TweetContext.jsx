import { useContext, createContext, useState, useEffect } from "react";
import { useProfile } from "./ProfileContext.jsx";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const TweetContext = createContext();
export const useTweet = () => useContext(TweetContext);

export const TweetProvider = ({ children }) => {
  const { userProfile } = useProfile();
  const { token, user } = useGlobal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(null);
  const [prefillTweet, setPrefillTweet] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setUserId(userProfile._id);
    }
  }, [userProfile]);

  //when ramdom user channel is opened ,we fetch its tweets
  const tweetQuery = useQuery({
    queryKey: ["tweets", userId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/tweets/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    enabled: !!userId,
    retry: 1,
  });
  const createTweetMutation = useMutation({
    mutationFn: async ({ tweetText, images = [], videos = [], videoMention = null }) => {
      const formData = new FormData();
      formData.append("content", tweetText);
      images.forEach((file) => formData.append("images", file));
      videos.forEach((file) => formData.append("videos", file));
      
      if (videoMention) {
        formData.append("videoMention", videoMention);
      }

      const res = await axios.post(
        `http://localhost:8000/api/v1/tweets`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["home-feed-tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweets", userId] });
      const message = data?.data?.message || "Tweet posted successfully!";
      showToast(message);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to post tweet";
      showToast(message);
    },
  });
  const homeFeedTweetsQuery = useQuery({
    queryKey: ["home-feed-tweets"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/tweets/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
    retry: 1,
  });

  const myTweetsQuery = useQuery({
    queryKey: ["my-tweets", user?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/tweets/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    enabled: !!user?._id && !!token,
    retry: 1,
  });

  const updateTweetMutation = useMutation({
    mutationFn: async ({ tweetId, content }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/tweets/${tweetId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["home-feed-tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweets", userId] });
      showToast(data?.message || "Tweet updated successfully!");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to update tweet");
    },
  });

  const deleteTweetMutation = useMutation({
    mutationFn: async (tweetId) => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/tweets/${tweetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["home-feed-tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweets", userId] });
      showToast(data?.message || "Tweet deleted successfully!");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to delete tweet");
    },
  });

  const toggleTweetLikeMutation = useMutation({
    mutationFn: async (tweetId) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/t/${tweetId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data, tweetId) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["home-feed-tweets"] });
      queryClient.invalidateQueries({ queryKey: ["tweets", userId] });
      queryClient.invalidateQueries({ queryKey: ["liked-tweets"] });
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to like tweet");
    },
  });

  const [activeTab, setActiveTab] = useState("for-you");

  const followingTweetsQuery = useQuery({
    queryKey: ["following-tweets"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/tweets/following`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
    retry: 1,
  });

  const likedTweetsQuery = useQuery({
    queryKey: ["liked-tweets"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/likes/tweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
    retry: 1,
  });

  return (
    <TweetContext.Provider
      value={{
        tweetQuery,
        userId,
        createTweet: createTweetMutation,
        updateTweet: updateTweetMutation,
        deleteTweet: deleteTweetMutation,
        toggleTweetLike: toggleTweetLikeMutation,
        homeFeedTweetsQuery,
        followingTweetsQuery,
        likedTweetsQuery,
        myTweetsQuery,
        activeTab,
        setActiveTab,
        prefillTweet,
        setPrefillTweet,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};
