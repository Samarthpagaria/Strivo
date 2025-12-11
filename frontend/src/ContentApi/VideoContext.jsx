import { useContext, createContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const VideoContext = createContext();

export const useVideo = () => useContext(VideoContext);

export const VideoProvider = ({ children, username, userId }) => {
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
  return (
    <VideoContext.Provider
      value={{
        videos: videoQuery.data?.data?.videos || [],
        pagination: videoQuery.data?.data?.pagination,
        isLoading: videoQuery.isLoading,
        isError: videoQuery.isError,
        page,
        setPage,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
