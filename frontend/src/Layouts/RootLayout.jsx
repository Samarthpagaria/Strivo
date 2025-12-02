import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../project_components/Header";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isAuth = path === "/login" || path === "/register";
  return (
    <>
      {!isAuth && <Header />}
      <Outlet />
    </>
  );
};
export default RootLayout;
