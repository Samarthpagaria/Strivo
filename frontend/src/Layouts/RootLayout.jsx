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
  const mainContentRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isAuth = path === "/login" || path === "/register";

  // Check if we are on a profile route and get the username
  const match = useMatch("/@:username");
  const username = match?.params?.username;

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
            <TweetsLayout width={isSidebarExpanded ? "w-150" : "w-160"} />
          </TweetProvider>
        </ProfileProvider>
      </div>
    </div>
  );
};

export default RootLayout;
