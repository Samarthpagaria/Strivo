import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";

const SmoothScroll = ({ children }) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative w-full h-full"
    >
      <div ref={contentRef} className="w-full min-h-full">
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
