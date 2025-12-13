import { useContext, createContext, useState, useEffect } from "react";
import { useProfile } from "./ProfileContext.jsx";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const TweetContext = createContext();
export const useTweet = () => useContext(TweetContext);

export const TweetProvider = ({ children }) => {
  const { userProfile } = useProfile();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setUserId(userProfile._id);
    }
  }, [userProfile]);
  const tweetQuery = useQuery({
    queryKey: ["tweets", userId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/tweets?userId=${userId}`
      );
      return res.data;
    },
    enabled: !!userId,
    retry: 1,
  });
  return (
    <TweetContext.Provider value={{ tweetQuery, userId }}>
      {children}
    </TweetContext.Provider>
  );
};
