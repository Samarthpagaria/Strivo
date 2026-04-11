import { useContext, createContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useGlobal } from "./GlobalContext";
import { useToast } from "./ToastContext";

const CommentContext = createContext();

export const useComment = () => {
  return useContext(CommentContext);
};

export const CommentProvider = ({ children, videoId }) => {
  const { token } = useGlobal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // get all comments of video
  const getCommentsQuery = useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/comments/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.data.docs;
    },
    enabled: !!videoId && !!token,
  });

  // create comment
  const createCommentMutation = useMutation({
    mutationFn: async ({ videoId, content }) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/comments/${videoId}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      // Refresh the comments list after adding a new one
      queryClient.invalidateQueries(["comments", videoId]);
      showToast(data?.message || "Comment added successfully!");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to add comment");
    },
  });

  // delete comment
  const removeCommentMutation = useMutation({
    mutationFn: async ({ commentId }) => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/comments/c/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      // Refresh the comments list after deleting a comment
      queryClient.invalidateQueries(["comments", videoId]);
      showToast(data?.message || "Comment deleted successfully!");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to delete comment");
    },
  });

  // update comment
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/comments/c/${commentId}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      // Refresh the comments list after updating
      queryClient.invalidateQueries(["comments", videoId]);
      showToast(data?.message || "Comment updated successfully!");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to update comment");
    },
  });

  // likeComment
  const likeCommentMutation = useMutation({
    mutationFn: async ({ commentId }) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/c/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      // Refresh the comments list after liking a comment
      queryClient.invalidateQueries(["comments", videoId]);
      showToast(data?.message || "Operation successful!");
    },
    onError: (error) => {
      showToast(error?.response?.data?.message || "Failed to toggle like");
    },
  });

  return (
    <CommentContext.Provider
      value={{
        comments: getCommentsQuery.data,
        isLoading: getCommentsQuery.isLoading,
        isError: getCommentsQuery.isError,
        getCommentsQuery,
        videoId,
        createCommentMutation,
        removeCommentMutation,
        updateCommentMutation,
        likeCommentMutation,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
