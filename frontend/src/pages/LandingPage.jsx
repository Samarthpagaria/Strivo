import React from "react";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/strivo_black_logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const [upvotes, setUpvotes] = React.useState(0);

  return (
    <div className="h-screen w-full bg-neutral-50 relative flex flex-col items-center antialiased selection:bg-indigo-100">
      {/* Autonomous Navigation Nodes */}
      {/* node 1: Scaled Identity (Left Corner) */}
      <div
        onClick={() => navigate("/")}
        className="fixed left-2 z-50 flex items-center justify-center cursor-pointer group"
      >
        <img src={logo} alt="Strivo" className="w-20 h-20 object-contain" />
        <span className="text-neutral-900 font-bold font-satoshi text-5xl tracking-tight pb-2 ">
          Strivo
        </span>
      </div>

      {/* node 2: Actions (Right Corner) */}
      <nav className="fixed top-3 right-8 z-50 flex items-center gap-4 px-1 py-1 bg-white border border-neutral-200 rounded-full shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden border border-neutral-200 rounded-full bg-neutral-50/50 hover:border-neutral-300 transition-all group/upvote shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]">
            <button
              onClick={() => setUpvotes((prev) => prev + 1)}
              className="px-3 py-2 text-lg font-bold text-neutral-500 hover:text-neutral-900 transition-colors font-satoshi border-r border-neutral-200 hover:bg-neutral-100 active:bg-neutral-200"
            >
              Upvote
            </button>
            <div className="px-1 py-1.5 min-w-[3rem] text-center flex items-center justify-center bg-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={upvotes}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="text-lg font-bold text-neutral-900 font-satoshi tabular-nums block"
                >
                  {upvotes}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <a
            href="#"
            className="text-neutral-500 hover:text-neutral-900 transition-colors p-2"
          >
            <Github size={24} />
          </a>
        </div>

        <div className="h-6 w-px bg-neutral-300" />

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-xl font-bold  text-neutral-500 hover:text-neutral-900 font-satoshi px-1 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-[#1d88fe] text-[#f2f3f4] text-xl font-bold  px-4 py-2.5 rounded-full hover:bg-blue-500/90 transition-all active:scale-95 shadow-lg shadow-blue-500/10"
          >
            Sign up
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LandingPage;
