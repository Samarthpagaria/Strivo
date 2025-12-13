import React, { createContext, useContext, useState } from "react";
import Toast from "../project_components/Toast";
import { AnimatePresence } from "framer-motion";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast-notification"
            message={toast.message}
            onClose={closeToast}
          />
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
