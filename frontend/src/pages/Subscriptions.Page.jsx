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
    <div className="absolute w-full h-[1px] bg-border dark:bg-white/10" />
    <div className="absolute h-full w-[1px] bg-border dark:bg-white/10" />
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
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest font-satoshi text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-background">
         <div className="p-10 border border-border dark:border-white/10 text-center relative bg-muted/10">
            <Crosshair className="-top-1.5 -left-1.5" />
            <Crosshair className="-top-1.5 -right-1.5" />
            <Crosshair className="-bottom-1.5 -left-1.5" />
            <Crosshair className="-bottom-1.5 -right-1.5" />
            <h2 className="text-xl font-black font-satoshi text-foreground tracking-tight uppercase">Sync Error</h2>
            <p className="text-muted-foreground font-inter text-sm mt-2 font-medium">Unable to fetch your subscriptions.</p>
         </div>
      </div>
    );
  }

  const channels = subscriptions?.subscribedChannel || [];

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden transition-colors duration-300">
      <div className="w-full mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border dark:border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground/60">
                <Users size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest font-satoshi">Network</span>
            </div>
            <h1 className="text-4xl font-black font-satoshi text-foreground tracking-tight">
              Subscriptions
            </h1>
            <p className="text-sm font-medium font-inter text-muted-foreground/80">
              Your network of followed creators.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="px-5 py-2.5 bg-muted/30 dark:bg-white/5 rounded-xl border border-border dark:border-white/10 flex items-center gap-4">
               <span className="text-2xl font-black font-satoshi text-foreground">{subscriptions?.subscribedChannelCount || 0}</span>
               <span className="text-[10px] font-bold font-inter text-muted-foreground uppercase tracking-widest">Following</span>
             </div>
          </div>
        </div>

        {/* Content Section - Tabular Grid */}
        <div className="mt-12">
          {channels.length > 0 ? (
            <div className="relative border-t border-l border-border dark:border-white/10 bg-background">
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
                     className="relative border-r border-b border-border dark:border-white/10 p-6 flex flex-col hover:bg-muted/10 dark:hover:bg-white/5 transition-colors group"
                   >
                     {/* Inner Crosshair for cells */}
                     <Crosshair className="-bottom-1.5 -right-1.5 z-10 opacity-30 group-hover:opacity-100 transition-opacity" />

                     <div className="flex items-center gap-4 mb-6">
                        <Link to={`/c/${channel.username}`} className="shrink-0 relative group/avatar">
                            <img
                                src={channel.avatar}
                                alt={channel.fullName}
                                className="w-16 h-16 rounded-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all border border-border dark:border-white/10"
                            />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link to={`/c/${channel.username}`}>
                                <h3 className="font-bold font-satoshi text-foreground truncate hover:text-primary transition-colors">
                                    {channel.fullName}
                                </h3>
                            </Link>
                            <p className="text-xs font-inter font-medium text-muted-foreground truncate">@{channel.username}</p>
                        </div>
                     </div>

                     <div className="mt-auto flex items-center justify-between pt-4 border-t border-border dark:border-white/5">
                        <Link 
                            to={`/c/${channel.username}`}
                            className="text-xs font-bold font-inter text-foreground hover:text-primary transition-colors"
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
            <div className="flex flex-col items-center justify-center py-40 relative border border-border dark:border-white/10 bg-muted/10 rounded-2xl overflow-hidden">
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />
              
              <div className="p-8 bg-background dark:bg-white/5 border border-border dark:border-white/10 rounded-full mb-8 shadow-sm">
                <UserPlus size={48} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black font-satoshi text-foreground uppercase tracking-tight">No Subscriptions</h3>
              <p className="text-sm font-medium font-inter text-muted-foreground/60 mt-3 max-w-sm text-center">
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
