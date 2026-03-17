import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGlobal } from "../ContentApi/GlobalContext";
import SubscribeButton from "../project_components/SubscribeButton";
import { PlaySquare, Users } from "lucide-react";

const Subscriptions = () => {
  const { user, token } = useGlobal();

  const {
    data: subscriptions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subscriptions", user?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/subscriptions/u/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
    enabled: !!user?._id && !!token,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Error loading subscriptions</h2>
        <p className="text-gray-500">{error?.response?.data?.message || error.message}</p>
      </div>
    );
  }

  const channels = subscriptions?.subscribedChannel || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-2xl">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Subscriptions</h1>
          <p className="text-sm text-gray-500 font-medium">
            You are following {subscriptions?.subscribedChannelCount || 0} creators
          </p>
        </div>
      </div>

      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="p-6 bg-white rounded-full shadow-sm mb-4">
            <PlaySquare className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No subscriptions yet</h2>
          <p className="text-gray-500 text-center max-w-md">
            When you subscribe to channels, they'll show up here. Start exploring and find creators you love!
          </p>
          <Link
            to="/"
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Explore Videos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <Link to={`/c/${channel.username}`} className="shrink-0">
                  <img
                    src={channel.avatar}
                    alt={channel.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-50 group-hover:border-blue-100 transition-colors"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/c/${channel.username}`}>
                    <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                      {channel.fullName}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 truncate">@{channel.username}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between gap-3">
                <Link 
                  to={`/c/${channel.username}`}
                  className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  View Channel
                </Link>
                <SubscribeButton 
                  channelId={channel._id} 
                  isSubscribed={true}
                  className="px-4! py-2! text-xs!"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
