import { useContext, createContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "./GlobalContext";

const VideoContext = createContext();

export const useVideo = () => useContext(VideoContext);

export const VideoProvider = ({ children, username, userId }) => {
  const { token, user, isAuthenticated } = useGlobal();
  const [page, setPage] = useState(1);

  const videoQuery = useQuery({
    queryKey: ["videos", username, page],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos?userId=${userId}&page=${page}&limit=20`
      );
      return res.data;
    },
    enabled: !!userId,
    keepPreviousData: true,
  });

  const homeFeedQuery = useQuery({
    queryKey: ["homeFeed", user?.username],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/home-feed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data.feed;
    },
    enabled: !!user?._id && !!isAuthenticated,
  });

  const likedVideosQuery = useQuery({
    queryKey: ["likedVideos", user?.username],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/v1/likes/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },

    enabled: !!user?._id && !!isAuthenticated,
  });
  return (
    <VideoContext.Provider
      value={{
        videos: videoQuery.data?.data?.videos || [],
        pagination: videoQuery.data?.data?.pagination,
        isLoading: videoQuery.isLoading,
        isError: videoQuery.isError,
        page,
        setPage,
        homeFeedQuery,
        likedVideosQuery,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
