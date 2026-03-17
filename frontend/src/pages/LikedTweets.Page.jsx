import React from "react";
import { motion } from "framer-motion";
import { Heart, Twitter, Sparkles, MessageSquare, Search, TrendingUp } from "lucide-react";
import Tweet from "../project_components/Tweet";
import { useTweet } from "../ContentApi/TweetContext";

const LikedTweets = () => {
  const { likedTweetsQuery } = useTweet();
  const tweetsData = likedTweetsQuery?.data?.data || { total: 0, tweets: [] };
  const tweets = tweetsData.tweets || [];
  
  if (likedTweetsQuery.isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-3xl animate-bounce shadow-2xl flex items-center justify-center border-4 border-blue-100">
             <Twitter className="text-blue-500 w-8 h-8 fill-blue-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading your favorites</p>
        </div>
      </div>
    );
  }

  if (likedTweetsQuery.isError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
         <div className="p-8 bg-white rounded-[3rem] border border-red-100 shadow-2xl text-center max-w-sm">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Sync Error</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Unable to fetch your liked interactions. Please check your connection.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fafafa]">
      {/* Sidebar Info Section */}
      <div className="w-full lg:w-[380px] lg:fixed lg:h-[calc(100vh-64px)] overflow-hidden lg:overflow-y-auto p-8 bg-white border-r border-gray-100">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
        >
          {/* Liked Tweets Static Badge */}
          <div className="relative p-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full -mr-24 -mt-24" />
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 rotate-12 transition-transform duration-500 hover:rotate-0">
                    <Heart size={32} className="text-white fill-white" />
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tight">Liked Posts</h2>
                   <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Saved Interactions</p>
                </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900">{tweetsData.total}</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Liked</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <TrendingUp size={20} className="text-indigo-600" />
                </div>
            </div>

            <div className="space-y-4 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Sparkles size={14} className="text-blue-600" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                      Curate your thoughts through likes. Saved tweets appear here for your personal collection.
                  </p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[380px] p-6 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <div className="flex gap-8">
                <button className="text-sm font-black text-slate-900 border-b-2 border-slate-900 pb-2">
                    Latest Likes
                </button>
                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Search Within
                </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-5 py-2 rounded-full border border-slate-200">
                <Search size={16} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Find a thought..."
                    className="bg-transparent border-none text-xs font-bold focus:ring-0 placeholder:text-slate-400 w-32 md:w-48"
                />
            </div>
          </div>

          {tweets.length > 0 ? (
            <div className="space-y-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              {tweets.map((tweet, index) => (
                <motion.div
                  key={tweet._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-50 last:border-0"
                >
                  <Tweet 
                    {...tweet} 
                    ownerDetails={tweet.owner} 
                    isLiked={true} 
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 space-y-8">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-100 relative group animate-in fade-in zoom-in duration-500">
                  <Heart size={40} className="text-slate-200 group-hover:text-pink-500 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] -z-10" />
              </div>
              <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">SILENCE OF THOUGHTS</h3>
                <p className="text-sm text-slate-400 font-bold leading-relaxed px-10">
                  No heartbeats yet. Explore the feed and tap the heart icon on any post to capture it in your collection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedTweets;
