import { useQuery } from "@tanstack/react-query";
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children, username }) => {
  const [userProfile, setUserProfile] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/users/c/${username}`
      );
      return res.data;
    },  
    enabled: !!username,
    retry: 1,
  });

  // Update userProfile when data changes
  useEffect(() => {
    if (data) {
      setUserProfile(data);
    }
  }, [data]);

  return (
    <ProfileContext.Provider
      value={{ userProfile, setUserProfile, isLoading, isError, error }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
