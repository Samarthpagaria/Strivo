import { createContext, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ToastContext";
import axios from "axios";
import { useGlobal } from "./GlobalContext";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user, token, setUser, setToken, setRefreshToken } = useGlobal();
  const { showToast } = useToast();
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
      setUser(data.data.user);
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      showToast("Login successful");
      console.log(user); 
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
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
      setUser(data.data.user);
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      showToast("Registration successful");
      console.log(user);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
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
      showToast("Logged out successfully");

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
