import React, { useState, useRef } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../project_components/Header";
import Sidebar from "../project_components/Sidebar";
import UmamiTracker from "../project_components/UmamiTracker";
import TweetsLayout from "./TweetsLayout";
import ScrollToTop from "../project_components/ScrollToTop";
import { TweetProvider } from "../ContentApi/TweetContext";
import { ProfileProvider } from "../ContentApi/ProfileContext";
import { useGlobal } from "../ContentApi/GlobalContext";
import Lenis from "lenis";
import gsap from "gsap";

const RootLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [tweetPanelWidth, setTweetPanelWidth] = useState(400); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const mainContentRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useGlobal();
  const path = location.pathname;
  const isAuthPage = path === "/login" || path === "/register";
  const isHomePage = path === "/";
  const isDocsPage = path === "/docs";

  // Check if we are on a profile route and get the username
  const match = useMatch("/c/:username");
  const username = match?.params?.username;

  // Resize handler
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 300; // Minimum width
    const maxWidth = window.innerWidth * 0.6; // Maximum 60% of window width

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setTweetPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add and remove event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, tweetPanelWidth]);

  // Lenis Smooth Scroll for the main content area
  React.useEffect(() => {
    if (!mainContentRef.current || (!user && isHomePage) || isAuthPage) return;

    const lenis = new Lenis({
      wrapper: mainContentRef.current,
      content: mainContentRef.current.firstElementChild,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
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
  }, [user, isHomePage, isAuthPage]);

  // Reset scroll position on route change
  React.useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // If on Auth pages (Login/Register), show just the page
  if (isAuthPage) {
    return (
      <>
        <UmamiTracker />
        <Outlet />
      </>
    );
  }

  // If NOT logged in and on HOME page, show ONLY the Home page (which renders LandingPage)
  if (!user && isHomePage) {
    return (
      <main className="w-full">
        <UmamiTracker />
        <Outlet context={{ scrollRef: mainContentRef }} />
      </main>
    );
  }

  return (
    <div className="container">
      <UmamiTracker />
      <Header />
      <div className="flex h-screen w-[100%] pt-16">
        {/* Sidebar Section */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />

        <ProfileProvider username={username}>
          <TweetProvider>
            {/* Main Content Area - Videos Section */}
            <div
              className={`flex-1 flex flex-col overflow-hidden ${
                isResizing ? "" : "transition-all duration-300"
              } ${isSidebarExpanded ? "ml-50" : "ml-16"}`}
            >
              <main
                ref={mainContentRef}
                className="flex-1 overflow-y-auto no-scrollbar relative"
              >
                <div className="w-full min-h-full">
                  <Outlet context={{ scrollRef: mainContentRef }} />
                  <ScrollToTop containerRef={mainContentRef} />
                </div>
              </main>
            </div>

            {/* Tweets Section */}
            {!isDocsPage && (
              <TweetsLayout
                width={tweetPanelWidth}
                onResizeStart={handleMouseDown}
              />
            )}
          </TweetProvider>
        </ProfileProvider>
      </div>
    </div>
  );
};

export default RootLayout;
