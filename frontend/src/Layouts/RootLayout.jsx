import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../project_components/Header";
import Sidebar from "../project_components/Sidebar";
import TweetsLayout from "./TweetsLayout";

const RootLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isAuth = path === "/login" || path === "/register";

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

        {/* Main Content Area - Videos Section */}
        <div
          className={`flex-1 flex flex-col overflow-hidden bg-blue-100 transition-all duration-300 ${
            isSidebarExpanded ? "ml-50" : "ml-16"
          }`}
        >
          <main className="flex-1 overflow-y-auto p-4">
            <p className="text-2xl font-bold text-blue-800">
              Hello - Videos Section
            </p>
            <Outlet />
          </main>
        </div>

        {/* Tweets Section */}
        <TweetsLayout width={isSidebarExpanded ? "w-150" : "w-160"} />
      </div>
    </div>
  );
};

export default RootLayout;
