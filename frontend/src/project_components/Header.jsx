import React from "react";
import logo from "../assets/strivo_black_logo.png";
import logo2 from "../assets/strivo_white_logo.png"
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { useSearch } from "../ContentApi/SearchContext";
import { useGlobal } from "../ContentApi/GlobalContext";
import { useAuth } from "../ContentApi/AuthContext";
import { useMyChannel } from "../ContentApi/myChannelContext";
import UserProfile from "./UserProfile";
import PublishVideoModal from "./PublishVideoModal";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";

const Header = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const { user } = useGlobal();
  const { logout } = useAuth();
  const { myChannelAddvideoMutation } = useMyChannel();
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/results?q=${searchQuery}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
const isDark = document.documentElement.classList.contains("dark");
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-4 container mx-auto">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src={isDark ? logo2 : logo}
            alt="strivo logo"
            className="w-20 h-16"
            draggable="false"
          />
        </div>
        <div className="flex-1 max-w-2xl px-4">
          <div className="flex items-center max-w-xl mx-auto bg-gray-100 dark:bg-white/5 rounded-full px-4 py-2 transition-colors">
            <Search className="text-gray-500 dark:text-gray-400 mr-2 h-5 w-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
              placeholder="Search..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-100 placeholder:font-satoshi font-inter placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <AnimatedThemeToggler className="p-2.5 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-all duration-300 border border-transparent hover:border-neutral-200 dark:hover:border-white/10" />
                  <motion.button
                    onClick={() => setIsUploadModalOpen(true)}
                    initial="initial"
                    whileHover="hover"
                    layout
                    className="flex items-center gap-0 px-2.5 py-2.5 bg-white dark:bg-white text-gray-900 border border-gray-100 rounded-full transition-colors duration-300 group overflow-hidden shadow-sm"
                  >
                    <motion.div
                      variants={{
                        initial: { rotate: 0 },
                        hover: { rotate: 360 },
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="shrink-0 flex items-center justify-center"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </motion.div>
                    <motion.span
                      variants={{
                        initial: { width: 0, opacity: 0, marginLeft: 0 },
                        hover: {
                          width: "auto",
                          opacity: 1,
                          marginLeft: 8,
                          transition: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                      className="overflow-hidden whitespace-nowrap text-sm font-satoshi font-medium tracking-widest leading-none pointer-events-none"
                    >
                      Add Video
                    </motion.span>
                  </motion.button>
                </div>
                <UserProfile user={user} onLogout={handleLogout} />
              </div>
            ) : (
              <>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="px-6 py-2 bg-white dark:bg-black text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </HoverBorderGradient>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="px-6 py-2 bg-black dark:bg-white text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </HoverBorderGradient>
              </>
            )}
          </div>
        </div>
      </div>

      <PublishVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={async (formData) => {
          await myChannelAddvideoMutation.mutateAsync(formData);
        }}
        mutation={myChannelAddvideoMutation}
      />
    </div>
  );
};

export default Header;
