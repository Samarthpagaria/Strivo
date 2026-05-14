import React from "react";
import { Outlet } from "react-router-dom";
import UmamiTracker from "../project_components/UmamiTracker";

const LayoutAuth = () => {
  return (
    <>
      <UmamiTracker />
      <Outlet />
    </>
  );
};

export default LayoutAuth;
