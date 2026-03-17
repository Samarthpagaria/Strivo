import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import confetti from "canvas-confetti";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useToast } from "../ContentApi/ToastContext";

const SubscribeButton = ({
  channelId,
  isSubscribed = false,
  className = "",
  subscribedText = "Subscribed",
  unsubscribedText = "Subscribe",
  onSubscriptionChange,
}) => {
  const { user, token, isAuthenticated } = useGlobal();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Don't show the button if user is viewing their own channel
  const isOwnChannel = user?._id === channelId;

  const toggleSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        {},
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
      // Invalidate ONLY the directly affected queries
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["channelSubscribers", channelId]);
      queryClient.invalidateQueries(["subscriptions", user?._id]);

      // Show success message based on backend response for robustness
      const msg = data?.message?.toLowerCase() || "";
      if (msg.includes("unsubscribed")) {
        showToast("unsubscribed");
      } else if (msg.includes("subscribed")) {
        showToast("subscribed");
      } else {
        showToast(data?.message || "Subscription updated");
      }

      // Call the optional callback
      if (onSubscriptionChange) {
        onSubscriptionChange(!isSubscribed);
      }
    },
    onError: (error) => {
      console.error("Subscription toggle failed:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update subscription";
      showToast(errorMessage);
    },
  });

  const handleSubscribe = (e) => {
    if (!isAuthenticated) {
      showToast("Please login to subscribe");
      return;
    }

    if (!isSubscribed) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 200,
        spread: 100,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#6366f1",
          "#ec4899",
          "#8b5cf6",
        ],
        ticks: 300,
        gravity: 1.5,
        scalar: 1,
        drift: 0,
      });
    }

    toggleSubscriptionMutation.mutate();
  };

  // Don't render if it's the user's own channel
  if (isOwnChannel) {
    return null;
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={toggleSubscriptionMutation.isPending}
      className={`px-6 py-2 rounded-full font-semibold transition-all ${
        isSubscribed
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-red-600 text-white hover:bg-red-700"
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {toggleSubscriptionMutation.isPending
        ? "Loading..."
        : isSubscribed
        ? subscribedText
        : unsubscribedText}
    </button>
  );
};

export default SubscribeButton;
