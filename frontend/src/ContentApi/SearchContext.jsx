import { createContext, useState, useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "./GlobalContext";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

// Custom hook for infinite search videos
export const useInfiniteSearchVideos = (searchQuery, sortBy = "createdAt") => {
  const { token } = useGlobal();
  return useInfiniteQuery({
    queryKey: ["videos", "infinite", searchQuery, sortBy],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get("http://localhost:8000/api/v1/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          query: searchQuery,
          page: pageParam,
          limit: 20, 
          sortBy,
          sortType: "desc",
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    enabled: !!searchQuery, 
    staleTime: 1000 * 60 * 5, 
  });
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
