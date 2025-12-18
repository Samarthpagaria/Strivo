import { useContext, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";

const SettingContext = createContext();
export const useSetting = () => useContext(SettingContext);

export const SettingProvider = ({ children }) => {
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token, refetchUser } = useGlobal();
  //query for change password
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/change-password`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data?.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message, "error");
    },
  });

  //update user detials
  const updateUserMutation = useMutation({
    mutationFn: async ({ fullName, email }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/update-account`,
        {
          fullName,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      showToast(data?.message);
      // Refetch user data from backend to ensure UI is in sync
      await refetchUser();
    },
    onError: (error) => {
      showToast(error?.response?.data?.message, "error");
    },
  });

  //update avatar
  const updateAvatarMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      showToast(data?.message);
      // Refetch user data from backend to ensure UI is in sync
      await refetchUser();
    },
    onError: (error) => {
      showToast(error?.response?.data?.message, "error");
    },
  });

  //update cover image
  const updateCoverImageMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/cover-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      showToast(data?.message);
      // Refetch user data from backend to ensure UI is in sync
      await refetchUser();
    },
    onError: (error) => {
      showToast(error?.response?.data?.message, "error");
    },
  });

  return (
    <SettingContext.Provider
      value={{
        oldPassword,
        setOldPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        changePasswordMutation,
        updateUser: updateUserMutation.mutateAsync,
        updateAvatar: updateAvatarMutation.mutateAsync,
        updateCoverImage: updateCoverImageMutation.mutateAsync,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
