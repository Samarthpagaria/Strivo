import React from "react";
import logo from "../assets/strivo_black_logo.png";
import logo2 from "../assets/strivo_white_logo.png";
import { Search, Plus, ArrowRight } from "lucide-react";
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
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains("dark"),
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const badgeSrc = isDark
    ? "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1147093&theme=dark&t=1778868823895"
    : "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1147093&theme=light&t=1778868595649";


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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
      <div className="flex justify-between items-center px-4 container mx-auto">
        <div className="flex items-center">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <img
              src={logo}
              alt="strivo logo"
              className="w-20 h-16 dark:hidden"
              draggable="false"
            />
            <img
              src={logo2}
              alt="strivo logo"
              className="w-20 h-16 hidden dark:block"
              draggable="false"
            />
          </div>
          {/* Badge in a zero-width relative container to avoid pushing the search bar */}
          <div className="hidden lg:block w-0 relative">
            <a
              href="https://www.producthunt.com/products/strivo?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-strivo"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              <img
                alt="Strivo - Stop Posting Everywhere. Start Growing Here | Product Hunt"
                width="140"
                height="30"
                src={badgeSrc}
                className="h-7 md:h-8 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300 max-w-none"
              />
            </a>
          </div>
        </div>
        <div className="flex-1 max-w-2xl px-4">
          <div className="flex items-center max-w-xl mx-auto bg-gray-100 dark:bg-neutral-800/80 border border-transparent dark:border-neutral-700 rounded-full px-4 py-2 transition-colors shadow-sm dark:shadow-none">
            <Search className="text-gray-500 dark:text-gray-400 mr-2 h-5 w-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
              placeholder="Search..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-100 placeholder:font-satoshi font-inter placeholder-gray-500 dark:placeholder-gray-500"
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
              <div className="flex items-center gap-[0.675rem]">
                <button
                  onClick={() => navigate("/login")}
                  className="text-[0.9rem] font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-satoshi px-1 transition-colors bg-transparent border-none outline-none cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="group/signup bg-[#fe4524c2] border border-transparent text-[#f2f3f4] text-[0.9rem] font-bold px-[0.6075rem] py-[0.30375rem] rounded-full hover:bg-[#fe4524] transition-all active:scale-95 shadow-lg shadow-blue-500/10 flex items-center gap-2 cursor-pointer"
                >
                  Sign up
                  <ArrowRight
                    size={18}
                    className="group-hover/signup:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
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
