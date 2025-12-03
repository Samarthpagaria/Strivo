import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../project_components/Header";
import Sidebar from "../project_components/Sidebar";

const RootLayout = () => {
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
      <div className="flex h-screen w-screen pt-20">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
