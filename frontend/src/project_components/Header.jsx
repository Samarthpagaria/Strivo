import React from "react";
import logo from "../assets/logo.png";
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 container mx-auto">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src={logo}
            alt="strivo logo"
            className="w-20 h-16 "
            draggable="false"
          />
        </div>
        <div className="flex-1 max-w-2xl px-4">
          <div className="flex items-center max-w-xl mx-auto bg-gray-100 rounded-full px-4 py-2">
            <Search className="text-gray-500 mr-2 h-5 w-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
              placeholder="Search..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder:font-satoshi font-inter placeholder-gray-500"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <AnimatedThemeToggler className="p-2.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-all duration-300 border border-transparent hover:border-neutral-200" />
                  <motion.button
                    onClick={() => setIsUploadModalOpen(true)}
                    initial="initial"
                    whileHover="hover"
                    layout
                    className="flex items-center gap-0 px-2.5 py-2.5 bg-white text-gray-900 border border-gray-100 rounded-full text-black transition-colors duration-300 group overflow-hidden shadow-sm"
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
                      className="overflow-hidden whitespace-nowrap text-sm font-satoshi font-medium  tracking-widest leading-none pointer-events-none"
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
                  className="px-6 py-2 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </HoverBorderGradient>
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="px-6 py-2 bg-black text-sm font-medium text-white hover:bg-gray-800 cursor-pointer"
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
