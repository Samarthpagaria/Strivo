import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGlobal } from "../ContentApi/GlobalContext";
import SubscribeButton from "../project_components/SubscribeButton";
import { Users, UserPlus } from "lucide-react";

// The Crosshair component creates the "+" design at the corners
const Crosshair = ({ className }) => (
  <div className={`absolute w-3 h-3 flex items-center justify-center pointer-events-none ${className}`}>
    <div className="absolute w-full h-[1px] bg-gray-300" />
    <div className="absolute h-full w-[1px] bg-gray-300" />
  </div>
);

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
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold font-inter text-gray-400">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-white">
         <div className="p-6 border border-gray-200 text-center relative">
            <Crosshair className="-top-1.5 -left-1.5" />
            <Crosshair className="-top-1.5 -right-1.5" />
            <Crosshair className="-bottom-1.5 -left-1.5" />
            <Crosshair className="-bottom-1.5 -right-1.5" />
            <h2 className="text-xl font-black font-satoshi text-gray-900 tracking-tight">Sync Error</h2>
            <p className="text-gray-500 font-inter text-sm mt-2 font-medium">Unable to fetch your subscriptions.</p>
         </div>
      </div>
    );
  }

  const channels = subscriptions?.subscribedChannel || [];

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      <div className="w-full mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
                <Users size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">Network</span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-gray-900 tracking-tight">
              Subscriptions
            </h1>
            <p className="text-sm font-medium font-inter text-gray-500">
              Your network of followed creators.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
               <span className="text-xl font-black font-satoshi text-gray-900">{subscriptions?.subscribedChannelCount || 0}</span>
               <span className="text-[10px] font-bold font-inter text-gray-400 uppercase tracking-widest">Following</span>
             </div>
          </div>
        </div>

        {/* Content Section - Tabular Grid */}
        <div className="mt-12">
          {channels.length > 0 ? (
            <div className="relative border-t border-l border-gray-200 bg-white">
               {/* Outer Crosshairs for the entire grid container */}
               <Crosshair className="-top-1.5 -left-1.5" />
               <Crosshair className="-top-1.5 -right-1.5" />
               <Crosshair className="-bottom-1.5 -left-1.5" />
               <Crosshair className="-bottom-1.5 -right-1.5" />

                <div 
                  className="grid" 
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
                >
                 {channels.map((channel) => (
                   <div
                     key={channel._id}
                     className="relative border-r border-b border-gray-200 p-6 flex flex-col hover:bg-gray-50 transition-colors"
                   >
                     {/* Inner Crosshair for cells */}
                     <Crosshair className="-bottom-1.5 -right-1.5 z-10" />

                     <div className="flex items-center gap-4 mb-6">
                        <Link to={`/c/${channel.username}`} className="shrink-0 relative group">
                            <img
                                src={channel.avatar}
                                alt={channel.fullName}
                                className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border border-gray-200"
                            />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link to={`/c/${channel.username}`}>
                                <h3 className="font-bold font-satoshi text-gray-900 truncate hover:text-blue-600 transition-colors">
                                    {channel.fullName}
                                </h3>
                            </Link>
                            <p className="text-xs font-inter font-medium text-gray-500 truncate">@{channel.username}</p>
                        </div>
                     </div>

                     <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <Link 
                            to={`/c/${channel.username}`}
                            className="text-xs font-bold font-inter text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            View Channel
                        </Link>
                        <SubscribeButton 
                            channelId={channel._id} 
                            isSubscribed={true}
                        />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 relative border border-gray-200 bg-gray-50/30">
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />
              
              <div className="p-6 bg-white border border-gray-100 rounded-full mb-6">
                <UserPlus size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black font-satoshi text-gray-900 uppercase tracking-tight">No Subscriptions</h3>
              <p className="text-sm font-medium font-inter text-gray-400 mt-2 max-w-xs text-center">
                You haven't subscribed to any channels yet. Start exploring to build your network.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
