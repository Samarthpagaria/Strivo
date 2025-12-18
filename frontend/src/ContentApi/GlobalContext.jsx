import { createContext, useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  // states
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      return JSON.parse(localUser);
    }
    return null;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem("refreshToken") || null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });
  const [isAppReady, setIsAppReady] = useState(false);
  const isAuthenticated = !!user && !!token;

  //refresh token mutation(tanstack)
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/refresh-token`,
        {
          refreshToken: refreshToken,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    },
    onError: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("sessionActive");
    },
  });
  //check token expiry
  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Refetch user from backend
  const refetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/users/current-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Failed to refetch user:", error);
      throw error;
    }
  };

  //initial app load
  useEffect(() => {
    const init = async () => {
      if (!token || !user) {
        setIsAppReady(true);
        return;
      }
      if (isTokenExpired(token)) {
        await refreshTokenMutation.mutateAsync();
      }
      sessionStorage.setItem("sessionActive", "true");
      setIsAppReady(true);
    };
    init();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        user,
        token,
        refreshToken,
        setRefreshToken,
        setUser,
        setToken,
        refetchUser,
        isAuthenticated,
        isAppReady,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
