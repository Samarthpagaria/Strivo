import React, { useEffect } from "react";
import strivoLogo from "../assets/strivo_black_logo.png";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: -120, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      exit={{ y: -120, opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 bg-white/95 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-4xl p-2 min-w-[320px] max-w-[450px] overflow-hidden"
    >
      {/* Internal Shimmer Layer */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
      />

      <img
        src={strivoLogo}
        alt="Strivo Logo"
        className="w-10 h-10 object-contain shrink-0 relative z-10"
      />
      <p className="text-sm font-bold font-satoshi text-slate-800 flex-1 leading-tight relative z-10">
        {message}
      </p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 relative z-10"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Toast;
