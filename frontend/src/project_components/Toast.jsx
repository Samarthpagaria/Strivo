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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 bg-white border border-gray-200 shadow-xl rounded-lg p-4 pr-10 min-w-[250px]"
    >
      <img
        src={strivoLogo}
        alt="Strivo Logo"
        className="w-8 h-8 object-contain"
      />
      <p className="text-sm font-medium text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
