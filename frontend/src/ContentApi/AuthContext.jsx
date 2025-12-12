import { createContext, useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import axios from "axios";
import { useGlobal } from "./GlobalContext";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user, token, setUser, setToken, setRefreshToken } = useGlobal();

  //login mutation
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",

        formData,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("sessionActive", "true");
    },
  });

  //register
  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("sessionActive", "true");
    },
  });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setUser(null);
      setToken(null);
      setRefreshToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("sessionActive");
    },
    onError: () => {
      console.log("Logout failed");
    },
  });
  return (
    <AuthContext.Provider
      value={{
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
