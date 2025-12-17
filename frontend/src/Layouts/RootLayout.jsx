import React, { useState, useRef } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../project_components/Header";
import Sidebar from "../project_components/Sidebar";
import TweetsLayout from "./TweetsLayout";
import ScrollToTop from "../project_components/ScrollToTop";
import { TweetProvider } from "../ContentApi/TweetContext";
import { ProfileProvider } from "../ContentApi/ProfileContext";

const RootLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [tweetPanelWidth, setTweetPanelWidth] = useState(400); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const mainContentRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isAuth = path === "/login" || path === "/register";

  // Check if we are on a profile route and get the username
  const match = useMatch("/@:username");
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

  if (isAuth) {
    return <Outlet />;
  }

  return (
    <div className="container">
      <Header />
      <div className="flex h-screen w-[100%] pt-16">
        {/* Sidebar Section */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />

        <ProfileProvider username={username}>
          {/* Main Content Area - Videos Section */}
          <div
            className={`flex-1 flex flex-col overflow-hidden   transition-all duration-300 ${
              isSidebarExpanded ? "ml-50" : "ml-16"
            }`}
          >
            <main
              ref={mainContentRef}
              className="flex-1 overflow-y-auto no-scrollbar relative"
            >
              <Outlet context={{ scrollRef: mainContentRef }} />
              <ScrollToTop containerRef={mainContentRef} />
            </main>
          </div>

          {/* Tweets Section */}
          <TweetProvider>
            <TweetsLayout
              width={tweetPanelWidth}
              onResizeStart={handleMouseDown}
            />
          </TweetProvider>
        </ProfileProvider>
      </div>
    </div>
  );
};

export default RootLayout;
