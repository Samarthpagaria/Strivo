import React, { useState, useEffect } from "react";

const ScrollToTop = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const toggleVisibility = () => {
      if (container.scrollTop > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    container.addEventListener("scroll", toggleVisibility);

    return () => {
      container.removeEventListener("scroll", toggleVisibility);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="opacity-50 hover:opacity-100 sticky bottom-6 left-1/2 z-50 p-2 bg-gray-200 border-1 border-gray-300 backdrop-blur-xl text-gray-400 rounded-full shadow-lg hover:bg-gray-100/90 transition-all duration-300 hover:scale-95"
          aria-label="Scroll to top"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
