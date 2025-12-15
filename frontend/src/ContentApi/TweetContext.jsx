import { useContext, createContext, useState, useEffect } from "react";
import { useProfile } from "./ProfileContext.jsx";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const TweetContext = createContext();
export const useTweet = () => useContext(TweetContext);

export const TweetProvider = ({ children }) => {
  const { userProfile } = useProfile();
  const { token } = useGlobal();
  const { showToast } = useToast();
  const [userId, setUserId] = useState(null);

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
        `http://localhost:8000/api/v1/tweets?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!userId,
    retry: 1,
  });
  const createTweetMutation = useMutation({
    mutationFn: async (tweetText) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/tweets`,
        { content: tweetText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      const message = data?.data?.message || "Tweet posted successfully!";
      showToast(message);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to post tweet";
      showToast(message);
    },
  });
  return (
    <TweetContext.Provider
      value={{ tweetQuery, userId, createTweet: createTweetMutation }}
    >
      {children}
    </TweetContext.Provider>
  );
};
